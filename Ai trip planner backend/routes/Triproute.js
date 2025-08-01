const express = require("express");
const mongoose = require("mongoose");

const TripRoutes = express.Router();
const { Tripmodel } = require("../db.js");

// ✅ CREATE TRIP
TripRoutes.post("/create", async (req, res) => {
  const { userSelection, Tripdata, email } = req.body;

  try {
    const Trip = await Tripmodel.create({
      userSelection,
      Tripdata,
      email,
    });
    res.status(201).json({ _id: Trip._id }); // Return the ObjectId
  } catch (e) {
    console.log("Error saving trip to DB.", e);
    res.status(500).json({ error: "Error saving trip" });
  }
});

// ✅ GET TRIP BY ID
TripRoutes.get("/view-trip/:tripId", async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Tripmodel.findById(tripId); // tripid from URL
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
});

TripRoutes.get("/my-trips/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const trips = await Tripmodel.find({ email });
    res.status(200).json(trips);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch trips." });
  }
});


module.exports = { TripRoutes };
