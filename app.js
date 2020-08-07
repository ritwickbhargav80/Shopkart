const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
let CronJob = require("cron").CronJob;
const Shop1 = require("./models/Shop");

const app = express();

mongoose.set("useCreateIndex", true);
require("./config/dbconnection");

app.use(cors({ exposedHeaders: "x-auth-token" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Shopkart Inc." });
});

const Shop = require("./models/Shop");
const Product = require("./models/Products");
const User = require("./models/User");

app.use("/api/shop", require("./routes/shop"));
app.use("/api/users", require("./routes/user"));

app.get("*", (req, res) => {
  res.status(404).json({ message: "Not Found!" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

var job = new CronJob(
  "00 00 00 * * *",
  async () => {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
    let shop = await Shop1.findOne({ _id: process.env.SHOP_ID });
    let obj = {
      products: [],
    };
    let x = 0,
      y = 0;
    for (let i = 0; i < shop.todaySales.length; i++) {
      product = await Product.findOne({ _id: shop.todaySales[i].product });
      let obj1 = {
        productName: undefined,
        quantity: undefined,
        price: undefined,
        discount: undefined,
      };
      obj1.productName = product.name;
      obj1.quantity = shop.todaySales[i].quantity;
      obj1.price = product.price;
      obj1.discount = product.discount;
      x += obj1.quantity;
      y += (obj1.price - (obj1.discount * obj1.price) / 100) * obj1.quantity;
      obj.products.push(obj1);
    }
    shop.prevSales.push({
      date: newDate.toLocaleDateString(),
      products: obj.products,
      totalUnits: x,
      totalSalePrice: y.toFixed(2),
    });
    shop.todaySales = [];
    await shop.save();
    console.log("Running Cron!");
  },
  null,
  true,
  "Asia/Kolkata"
);

job.start();
