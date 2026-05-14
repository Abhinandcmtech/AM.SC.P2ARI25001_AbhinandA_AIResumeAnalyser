const express = require("express");
const router = express.Router();
const { getUserResults, getResultById } = require("../controllers/resultController");
const { protect } = require("../middleware/authMiddleware");

router.get("/",    protect, getUserResults);
router.get("/:id", protect, getResultById);

module.exports = router;
