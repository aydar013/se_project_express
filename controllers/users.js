const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERRORS, itemError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const ConflictError = require("../errors/conflict-error");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return next(new BadRequestError("Must provide email"));
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("Email already exists"));
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) => {
          res.send({ name, avatar, email, _id: user._id });
        });
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

  if (!email || !password) {
    return next(new UnauthorizedError("Incorrect email or password"));
  }
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
  // User.findUserByCredentials(email, password)
  //   .then((user) => {
  //     if (!user || !password) {
  //       return next(
  //         new UnauthorizedError("yaaaay, Incorrect email or password"),
  //       );
  //     }

  //     const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
  //       expiresIn: "7d",
  //     });
  //     return res.send({ token });
  //   })
  //   .catch(next);
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
    .orFail()
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
