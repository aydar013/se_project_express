const User = require("../models/user");
const { itemError } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((e) => itemError(req, res, e));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((e) => itemError(req, res, e));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((e) => itemError(req, res, e));
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};
