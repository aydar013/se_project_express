const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ConflictError = require("../errors/conflict-error");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return next(new ConflictError("Email already exists"));
    }
    return null;
  });
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.send({ name, avatar, email, _id: user._id });
    })

    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(e);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: user });
      }
    })
    .catch((e) => {
      next(e);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
