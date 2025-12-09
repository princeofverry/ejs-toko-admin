const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const sequelize = require("./models");
require("dotenv").config();

const homeRoutes = require("./routes/homeRoutes");
const pembelianRoutes = require("./routes/pembelianRoutes");
const stockRoutes = require("./routes/stockRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

app.use("/", homeRoutes);
app.use("/", pembelianRoutes);
app.use("/", stockRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
