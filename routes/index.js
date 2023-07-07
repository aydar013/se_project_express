const router = require("express").Router();
const clothingItems = require("./clothingItems");
const user = require("./users");

const { ERROR_404 } = require("../utils/errors");

router.use("/users", user);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(ERROR_404).send({ message: "Requested resource not found" });
});

module.exports = router;
