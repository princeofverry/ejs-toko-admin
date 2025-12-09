const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const Produk = require("./Produk");

const Pembelian = sequelize.define("Pembelian", {
  jumlah: { type: DataTypes.INTEGER, allowNull: false },
  totalHarga: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "active" },
});

Produk.hasMany(Pembelian, { foreignKey: "produkId" });
Pembelian.belongsTo(Produk, { foreignKey: "produkId" });

module.exports = Pembelian;
