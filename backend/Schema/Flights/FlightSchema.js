import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    airline: { 
        type: String, 
        required: true 
    },
    flightNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    departureAirport: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Airport',
        required:true
    },
    arrivalAirport: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Airport',
        required:true
    },
    departureTime: { 
        type: Date, 
        required: true 
    },
    arrivalTime: { 
        type: Date, 
        required: true 
    },
    price: {
        type: Number,
        required: true,
        default: 5000
    }
});

const Flight = mongoose.model("Flight",flightSchema);

export default Flight;
