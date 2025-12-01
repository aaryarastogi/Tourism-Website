import mongoose, { mongo } from "mongoose";

const trainSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    number: { 
        type: String, 
        required: true, 
        unique: true 
    },
    stations:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Station'
    }],
    pricing: {
        sleeperClass: { type: Number, default: 500 },
        thirdAC: { type: Number, default: 1200 },
        secondAC: { type: Number, default: 2000 },
        firstAC: { type: Number, default: 3500 },
        secondSeating: { type: Number, default: 400 },
        vistadomeAC: { type: Number, default: 2500 },
        acChairCar: { type: Number, default: 1500 }
    }
});

const Train = mongoose.model("Train", trainSchema);

export default Train;