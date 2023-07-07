const router = require("express").Router();

const {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemsId", updateItem);
router.put("/:itemsId/likes", likeItem);
router.delete("/:itemsId/likes", dislikeItem);

module.exports = router;
