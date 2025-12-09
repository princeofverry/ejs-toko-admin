const Produk = require("../models/Produk");
const Stock = require("../models/Stock");

exports.home = async (req, res) => {
  const produk = await Produk.findAll({ include: Stock });
  res.render("home", { produk });
};
