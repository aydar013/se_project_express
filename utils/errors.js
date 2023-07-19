const ERRORS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ALREADY_EXIST: 409,
  INTERNAL_SERVER_ERROR: 500,
  DUPLICATED_KEY_ERROR: 11000,
};

const itemError = (req, res, e) => {
  if (e.name === "ValidationError" || e.name === "CastError") {
    return res.status(ERRORS.BAD_REQUEST).send({
      message: "Invalid Data Input",
    });
  }
  if (e.name === "DocumentNotFoundError") {
    return res.status(ERRORS.NOT_FOUND).send({
      message: "Error: Not Found",
    });
  }
  return res
    .status(ERRORS.INTERNAL_SERVER_ERROR)
    .send({ message: "Something went wrong" });
};

module.exports = {
  ERRORS,
  itemError,
};
