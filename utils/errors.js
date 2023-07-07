const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

const itemError = (req, res, e) => {
  if (e.name === "ValidationError" || e.name === "CastError") {
    res.status(ERROR_400).send({ message: "Invalid Data Input" });
  } else if (e.name === "DocumentNotFoundError" || e.statusCode === 404) {
    res.status(ERROR_404).send({ message: "Error: Not Found" });
  } else {
    res.status(ERROR_500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  ERROR_404,
  itemError,
};
