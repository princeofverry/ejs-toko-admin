const express = require("express");
const router = express.Router();

const pembelianController = require("../controllers/pembelianControllers");

router.get("/pembelian", pembelianController.getPembelian);
router.post("/pembelian", pembelianController.createPembelian);

router.get("/done/:id", pembelianController.viewDone);
router.post("/done/:id", pembelianController.markDone);

router.post("/done-all", pembelianController.markDoneAll);
router.post("/cancel/:id", pembelianController.cancelPembelian);

module.exports = router;
