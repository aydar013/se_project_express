const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { ERRORS } = require("../utils/errors");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(ERRORS.UNAUTHORIZED)
      .send({ message: "Authorization error" });
  }

  const token = auth.replace("Bearer ", "");
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

// module.exports = { auth };
