const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

mongoose.set("useCreateIndex", true);
require("./config/dbconnection");

app.use(cors({ exposedHeaders: "x-auth-token" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Shopkart Inc." });
});

const Shop = require("./models/Shop");
const Product = require("./models/Products");
const Customers = require("./models/Customers");

app.use("/api/shop", require("./routes/shop"));
app.use("/api/customer", require("./routes/customer"));

app.get("*", (req, res) => {
  res.status(404).json({ message: "Not Found!" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
