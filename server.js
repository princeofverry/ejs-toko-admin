const express = require("express");
const path = require("path");
const Stock = require("./models/Stock");
const Produk = require("./models/Produk");
const Pembelian = require("./models/Pembelian");
const sequelize = require("./models");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layout");

app.get("/", async (req, res) => {
  const produk = await Produk.findAll({ include: Stock });
  res.render("home", { produk });
});

app.get("/pembelian", async (req, res) => {
  const pembelian = await Pembelian.findAll({ include: Produk });
  const produk = await Produk.findAll({ include: Stock });

  res.render("pembelian", {
    produk,
    pembelian,
  });
});

app.post("/pembelian", async (req, res) => {
  const { produkId, jumlah } = req.body;

  const product = await Produk.findByPk(produkId, { include: Stock });

  if (!product || product.Stock.jumlah < jumlah) {
    return res.send("Stok tidak cukup!");
  }

  const total = product.harga * jumlah;
  const stokSebelum = product.Stock.jumlah;
  const stokSesudah = product.Stock.jumlah - jumlah;

  await product.Stock.update({ jumlah: stokSesudah });

  const beli = await Pembelian.create({
    produkId,
    jumlah,
    totalHarga: total,
    status: "active",
  });

  res.redirect("/pembelian");
});

app.get("/done/:id", async (req, res) => {
  const id = req.params.id;

  const pembelian = await Pembelian.findByPk(id, {
    include: {
      model: Produk,
      include: Stock,
    },
  });

  if (!pembelian) return res.send("Transaksi tidak ditemukan");

  res.render("done", {
    pembelian,
    produk: pembelian.Produk,
    stock: pembelian.Produk.Stock,
  });
});

app.post("/cancel/:id", async (req, res) => {
  const id = req.params.id;

  const pembelian = await Pembelian.findByPk(id, { include: Produk });
  if (!pembelian) return res.send("Pembelian tidak ditemukan!");

  if (pembelian.status === "cancelled") {
    return res.redirect("/pembelian");
  }

  pembelian.status = "cancelled";
  await pembelian.save();

  const p = await pembelian.getProduk();
  const stock = await p.getStock();
  await stock.update({ jumlah: stock.jumlah + pembelian.jumlah });

  res.redirect("/pembelian");
});

app.get("/stock", async (req, res) => {
  const produk = await Produk.findAll({ include: Stock });

  res.render("stock", { produk });
});

app.post("/stock", async (req, res) => {
  const { produkId, jumlah } = req.body;

  const product = await Produk.findByPk(produkId, { include: Stock });
  if (!product) return res.send("Produk tidak ditemukan!");

  const newStock = parseInt(jumlah);

  if (!product.Stock) {
    await Stock.create({
      produkId,
      jumlah: newStock,
    });
  } else {
    await product.Stock.update({
      jumlah: newStock,
    });
  }

  res.redirect("/stock");
});

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
