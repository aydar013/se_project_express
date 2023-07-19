const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemsId", auth, updateItem);
router.put("/:itemsId/likes", auth, likeItem);
router.delete("/:itemsId/likes", auth, dislikeItem);

module.exports = router;
