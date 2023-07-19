const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { ERRORS } = require("../utils/errors");

const auth = (req, res, next) => {
  const authorization = req.headers.auth;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERRORS.UNAUTHORIZED)
      .send({ message: "Authorization error" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err);
    return res
      .status(ERRORS.UNAUTHORIZED)
      .send({ message: "Authorization error" });
  }
  req.user = payload;

  return next();
};

module.exports = { auth };
