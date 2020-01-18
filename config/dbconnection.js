const mongoose = require("mongoose");
require("dotenv").config();

const dburl = process.env.MONGO_URI;
const dbbackupurl = process.env.MONGO_BACKUP_URI;
mongoose
  .connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch(err => {
    mongoose
      .connect(dbbackupurl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("Database connected successfully!");
      });
    console.log(err);
  });
