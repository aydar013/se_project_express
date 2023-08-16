const ClothingItem = require("../models/clothingItem");
const { ERRORS, itemError } = require("../utils/errors");
const ConflictError = require("../errors/conflict-error");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((e) => {
      next(e);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!name && !weather && !imageUrl) {
    next(new BadRequestError("Missing some information"));
  }

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(e);
      }
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
        return;
      }
      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("You are not authorized to delete this item"));
        return;
      }
      item.deleteOne().then(() => {
        res.send({ message: "Item deleted" });
      });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(e);
      }
    });
};

const updateItem = (req, res, next) => {
  const { itemsId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemsId, { $set: { imageUrl } })
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
        return;
      }
      res.send({ data: item });
    })
    .catch((e) => {
      next(e);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemsId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
        return;
      }
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(e);
      }
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemsId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
        return;
      }
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
};
