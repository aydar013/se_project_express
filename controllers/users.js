const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERRORS, itemError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    res.status(ERRORS.BAD_REQUEST).send({ message: "Must provide email" });
    return;
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(ERRORS.ALREADY_EXIST)
          .send({ message: "Email already exists" });
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) => {
          res.send({
            data: { name: user.name, avatar: user.avatar, email: user.email },
          });
        });
    })
    .catch((e) => {
      itemError(req, res, e);
    });
};

// const createUser = (req, res, next) => {
//   const { name, avatar, email, password } = req.body;

//   bcrypt
//     .hash(password, 10)
//     .then((hash) => User.create({ name, avatar, email, password: hash }))
//     .then((user) => res.send({ name, avatar, email, _id: user._id }))
//     .catch((e) => {
//       itemError(req, res, e);
//     });
// };

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() =>
      res
        .status(ERRORS.UNAUTHORIZED)
        .send({ message: "User is not authorized" }),
    );
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const update = { name, avatar };

  User.findByIdAndUpdate({ _id: req.user._id }, update, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(ERRORS.NOT_FOUND).send({ message: "User not found" });
      }
      return res.send({
        data: { user, message: "Username updated successfully" },
      });
    })
    .catch((e) => {
      itemError(req, res, e);
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      itemError(req, res, e);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
