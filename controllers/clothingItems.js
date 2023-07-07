const ClothingItem = require("../models/clothingItem");
const { itemError } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((e) => itemError(req, res, e));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => itemError(req, res, e));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.send({ message: `Item deleted` }))
    .catch((e) => itemError(req, res, e));
};

const updateItem = (req, res) => {
  const { itemsId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemsId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((e) => itemError(req, res, e));
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemsId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((e) => itemError(req, res, e));
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemsId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
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
