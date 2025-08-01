const express = require("express");
const app = express();
const cors = require("cors")
require("dotenv").config();

const PORT = process.env.PORT;
const mongodb_url = process.env.mongodb_url;
const mongoose = require("mongoose")


app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));


const {TripRoutes} = require('./routes/Triproute');
app.use('/trip' , TripRoutes);


async function main() {
  await mongoose.connect(mongodb_url).then(() => {
    console.log("✅ Connected to MongoDB");
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
main();
