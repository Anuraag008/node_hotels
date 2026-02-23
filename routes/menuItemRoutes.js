const express = require("express");
const router = express.Router();
const menuItems = require("../models/menuItem");

// POST method to add a new menu item
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newMenu = new menuItems(data);
    const response = await newMenu.save();
    console.log("data saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET method to retrieve all menu items
router.get("/", async (req, res) => {
  try {
    const data = await menuItems.find();
    console.log("Menu items fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedMenu = req.body;
    const response = await menuItems.findByIdAndUpdate(id, updatedMenu, {
      new: true,
      newValidatorrunValidators: true,
    });
    if (!response) {
      res.status(404).json({ error: "menu not found" });
    }

    console.log("menu updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await menuItems.findByIdAndDelete(id);
    if (!response) {
      res.status(404).json({ error: "menu not found" });
    }
    console.log("menu deleted");
    res.status(200).json({ message: "menu deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
