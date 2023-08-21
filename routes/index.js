const router = require("express").Router();
const clothingItems = require("./clothingItems");
const user = require("./users");
const { login, createUser } = require("../controllers/users");
const { validateUser, validateAuth } = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-error");

router.use("/users", user);
router.use("/items", clothingItems);

router.post("/signup", validateUser, createUser);
router.post("/signin", validateAuth, login);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
