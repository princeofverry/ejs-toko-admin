const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockControllers");

router.get("/stock", stockController.getStock);
router.post("/stock", stockController.updateStock);

module.exports = router;
