const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  Brand: String,
  Model: String,
  AccelSec: Number,
  TopSpeed_KmH: Number,
  Range_Km: Number,
  Efficiency_WhKm: Number,
  FastCharge_KmH: Number,
  RapidCharge: String,
  PowerTrain: String,
  PlugType: String,
  BodyStyle: String,
  Segment: String,
  Seats: Number,
  PriceEuro: Number,
  Date: String,
});

module.exports = mongoose.model('Car', carSchema);