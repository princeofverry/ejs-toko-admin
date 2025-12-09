const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const Produk = require("./Produk");

const Stock = sequelize.define("Stock", {
  jumlah: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

Produk.hasOne(Stock, { foreignKey: "produkId" });
Stock.belongsTo(Produk, { foreignKey: "produkId" });

module.exports = Stock;
