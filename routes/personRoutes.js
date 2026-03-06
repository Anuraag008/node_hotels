const express = require("express");
const router = express.Router();
const person = require("../models/person");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //Assuming the request body contains the person data

    //create a new person document using the mongoose model
    const newPerson = new person(data);

    //Save the new person to the database
    const response = await newPerson.save();
    console.log("data saved");

    const payload = {
      id: response.id,
      username: response.username,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is :", token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save person data" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Find the user by username
    const user = await person.findOne({ username: username });

    // If user not found, and password does not match return an error response
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // If authentication is successful, generate a JWT token
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = generateToken(payload);
    console.log("Token is :", token);

    // return the token in the response
    res.json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user; // Assuming the user data is attached to the request object by the jwtAuthMiddleware
    console.log("User data :", userData);

    const userId = userData.id; // Assuming the user ID is stored in the token payload
    const user = await person.findById(userId); // Fetch the user data from the database using the user ID

    res.status(200).json({ user: user }); // Return the user data in the response
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await person.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch person data" });
  }
});

router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;
    if (workType == "chef" || workType == "waiter" || workType == "manager") {
      const data = await person.find({ work: workType });
      console.log("data fetched");
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: "Invalid work type" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch person data" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedPersonData = req.body;
    const response = await person.findByIdAndUpdate(id, updatedPersonData, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }

    console.log("data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await person.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ error: "person not found" });
    }
    console.log("data deleted");
    res.status(200).json({ message: "person deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
