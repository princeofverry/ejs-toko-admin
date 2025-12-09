const Produk = require("../models/Produk");
const Stock = require("../models/Stock");

exports.getStock = async (req, res) => {
  const produk = await Produk.findAll({ include: Stock });
  res.render("stock", { produk });
};

exports.updateStock = async (req, res) => {
  const { produkId, jumlah } = req.body;
  const product = await Produk.findByPk(produkId, { include: Stock });

  if (!product) return res.send("Produk tidak ditemukan!");

  if (!product.Stock) {
    await Stock.create({ produkId, jumlah });
  } else {
    await product.Stock.update({ jumlah });
  }

  res.redirect("/stock");
};
