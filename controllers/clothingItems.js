const ClothingItem = require("../models/clothingItem");
const { ERRORS, itemError } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((e) => itemError(req, res, e));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(ERRORS.BAD_REQUEST).send({
          message: "Invalid data passed for creating or updating a user.",
        });
      } else {
        res
          .status(ERRORS.INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred" });
      }
    })
    .catch((e) => itemError(req, res, e));
};

const deleteItem = (req, res) => {
  const itemId = req.params;
  const userId = req.user._id;

  //   ClothingItem.findByIdAndDelete(itemId)
  //     .orFail()
  //     .then((item) => {
  //       if (String(item.owner) !== req.user._id) {
  //         return res
  //           .status(ERRORS.FORBIDDEN)
  //           .send({ message: "You are not authorized to delete this item" });
  //       }
  //     })
  //     .then(() => res.status(200).send({ message: `Item deleted` }))
  //     .catch((e) => itemError(req, res, e));
  // };
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.equals(userId)) {
        return item.remove(() => res.send({ item }));
      }

      return res
        .status(ERRORS.FORBIDDEN)
        .send({ message: "Not Authorized to delete" });
    })

    .catch((e) => itemError(req, res, e));
};

const updateItem = (req, res) => {
  const { itemsId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemsId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => itemError(req, res, e));
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemsId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then(() =>
      res.status(200).send({ message: "You successfully liked the item" }),
    )
    .catch((e) => itemError(req, res, e));
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemsId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => itemError(req, res, e));
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
};
