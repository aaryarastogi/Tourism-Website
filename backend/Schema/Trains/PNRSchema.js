import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  no: Number,
  booking_status: String,
  current_status: String
});

const pnrSchema = new mongoose.Schema({
  pnr: { type: String, required: true, unique: true },
  train: {
    name: String,
    number: String
  },
  doj: String,
  from_station: {
    name: String
  },
  to_station: {
    name: String
  },
  passengers: [passengerSchema]
});

export const PNR = mongoose.model("PNR", pnrSchema);
