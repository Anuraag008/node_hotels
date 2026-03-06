const express = require("express");
const app = express();
const db = require("./db");
require("dotenv").config();
const passport = require("./auth");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// const person = require("./models/person");
// const menuItems = require("./models/menuItem");

// Middleware Function
const logRequest = (req, res, next) => {
  console.log(`${new Date()} Request Made to : ${req.orignalUrl} `);
  next();
};

app.use(logRequest);

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate("local", { session: false });

app.get("/", localAuthMiddleware, (req, res) => {
  res.send("Hello from my hotel... how i can help you? ");
});

// Import routes
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuItemRoutes");

// Use the routes
app.use("/menu", menuRoutes);
app.use("/person", personRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port 5000`);
});
