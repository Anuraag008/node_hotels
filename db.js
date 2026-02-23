const mongoose = require("mongoose");
require("dotenv").config();

//const mongoURL = "mongodb://localhost:27017/hotels";
//const mongoURL ="mongodb+srv://helloworld:qwerty12345@cluster0.ztqdi7e.mongodb.net/myDB?retryWrites=true&w=majority&authSource=admin";
const mongoURL = process.env.MONGODB_URL;
mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("connected to mongoDB");
});
db.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});
db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = db;
