const express = require("express");
const { getAll, getOne, create, update, remove } = require("../controllers/itemsController");
const { authenticate } = require("../middleware/auth");
const { chaosMiddleware } = require("../middleware/chaos");

const router = express.Router();

// All item routes require authentication + chaos simulation
router.use(authenticate);
router.use(chaosMiddleware);

router.get("/",       getAll);
router.get("/:id",    getOne);
router.post("/",      create);
router.put("/:id",    update);
router.delete("/:id", remove);

module.exports = router;
