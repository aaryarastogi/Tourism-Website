import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  station: { type: String, required: true },
  status: { type: String, required: true }, // e.g. "Departed", "Expected at 13:00", "Not yet"
  km: { type: Number, required: true },
  time: { type: String, required: true }
});

const liveTrainSchema = new mongoose.Schema({
  train: {
    number: { type: String, required: true },
    name: { type: String, required: true },
    start_station: { type: String, required: true },
    end_station: { type: String, required: true },
    total_km: { type: Number, required: true },
    origin_time: { type: String, required: true }, 
    end_time: { type: String, required: true } 
  },
  current_status: {
    last_station: { type: String, required: true },
    next_station: { type: String, required: true },
    delay: { type: String, default: "On time" }, // e.g. "15 min late"
    updated_at: { type: Date, default: Date.now }
  },
  route: [routeSchema]
}, { timestamps: true });


export const LiveTrain = mongoose.model("LiveTrain",liveTrainSchema);
