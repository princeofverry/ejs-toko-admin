const Produk = require("../models/Produk");
const Stock = require("../models/Stock");
const Pembelian = require("../models/Pembelian");

exports.getPembelian = async (req, res) => {
  const pembelian = await Pembelian.findAll({ include: Produk });
  const produk = await Produk.findAll({ include: Stock });

  res.render("pembelian", { produk, pembelian });
};

exports.createPembelian = async (req, res) => {
  const { produkId, jumlah } = req.body;

  const product = await Produk.findByPk(produkId, { include: Stock });
  if (!product || product.Stock.jumlah < jumlah)
    return res.send("Stok tidak cukup!");

  await product.Stock.update({
    jumlah: product.Stock.jumlah - jumlah,
  });

  await Pembelian.create({
    produkId,
    jumlah,
    totalHarga: product.harga * jumlah,
    status: "active",
  });

  res.redirect("/pembelian");
};

exports.viewDone = async (req, res) => {
  const pembelian = await Pembelian.findByPk(req.params.id, {
    include: { model: Produk, include: Stock },
  });

  if (!pembelian) return res.send("Transaksi tidak ditemukan");

  res.render("done", {
    pembelian,
    produk: pembelian.Produk,
    stock: pembelian.Produk.Stock,
  });
};

exports.markDone = async (req, res) => {
  const pembelian = await Pembelian.findByPk(req.params.id);
  if (!pembelian) return res.send("Transaksi tidak ditemukan");

  pembelian.status = "done";
  await pembelian.save();

  res.redirect("/pembelian");
};

exports.markDoneAll = async (req, res) => {
  const list = await Pembelian.findAll({
    where: { status: "active" },
    include: Produk,
  });

  const total = list.reduce((a, b) => a + b.totalHarga, 0);

  for (let p of list) {
    p.status = "done";
    await p.save();
  }

  res.render("done-all", { items: list, total });
};

exports.cancelPembelian = async (req, res) => {
  const pembelian = await Pembelian.findByPk(req.params.id, {
    include: Produk,
  });
  if (!pembelian) return res.send("Pembelian tidak ditemukan!");

  pembelian.status = "cancelled";
  await pembelian.save();

  const product = await pembelian.getProduk();
  const stock = await product.getStock();
  await stock.update({
    jumlah: stock.jumlah + pembelian.jumlah,
  });

  res.redirect("/pembelian");
};
