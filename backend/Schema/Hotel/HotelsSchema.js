import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  city: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'City', 
    required: true 
  },
  pricing: {
    singleRoom: { type: Number, default: 1500 },
    doubleRoom: { type: Number, default: 2000 },
    tripleRoom: { type: Number, default: 2500 },
    quadRoom: { type: Number, default: 3000 },
    roomWithHall: { type: Number, default: 5000 }
  }
});

const Hotel=mongoose.model("Hotel",hotelSchema);

export default Hotel;