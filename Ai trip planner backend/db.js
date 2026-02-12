const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tripSchema = new Schema({
  userSelection: { type: Object },
  Tripdata: { type: Object, required: true },
  email: { type: String },
});

const Tripmodel = model("Trip", tripSchema, "User-trip-details");
module.exports = { Tripmodel };
