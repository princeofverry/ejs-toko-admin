const Produk = require("../models/Produk");
const Stock = require("../models/Stock");

(async () => {
  try {
    const produkData = [
      { nama: "Sabun Mandi", harga: 8000, stok: 50 },
      { nama: "Shampoo", harga: 12000, stok: 40 },
      { nama: "Pasta Gigi", harga: 10000, stok: 60 },
      { nama: "Beras 5kg", harga: 65000, stok: 20 },
      { nama: "Minyak Goreng 1L", harga: 15000, stok: 35 },
      { nama: "Gula 1kg", harga: 14000, stok: 30 },
      { nama: "Teh Celup", harga: 7000, stok: 70 },
      { nama: "Kopi Sachet", harga: 2000, stok: 100 },
      { nama: "Telur 1kg", harga: 27000, stok: 25 },
      { nama: "Indomie Goreng", harga: 3500, stok: 200 },
    ];

    for (const item of produkData) {
      const produk = await Produk.create({
        nama: item.nama,
        harga: item.harga,
      });

      await Stock.create({
        produkId: produk.id,
        jumlah: item.stok,
      });
    }

    console.log("Seed produk + stock berhasil!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
