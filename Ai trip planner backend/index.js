const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ===== Environment Variables =====
const PORT = process.env.PORT || 5000;
const mongodb_url = process.env.mongodb_url;

// ===== Middleware =====
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// ===== Routes =====
const { TripRoutes } = require("./routes/Triproute");
app.use("/trip", TripRoutes);

// ===== MongoDB Connection =====
mongoose
  .connect(mongodb_url)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
