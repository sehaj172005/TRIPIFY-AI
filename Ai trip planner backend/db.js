const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const objectId = Schema.Types.ObjectId;

const tripSchema = new Schema({
    userSelection : {type:Object},
    Tripdata : {type:Object,required:true},
    email : {type:String}

})

const Tripmodel = model("User-trip-details" , tripSchema,"User-trip-details");
module.exports = {Tripmodel}

