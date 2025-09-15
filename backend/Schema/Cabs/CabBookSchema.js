import mongoose from "mongoose";

const cabBookSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    fromCity:{       
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    departureDate:{
        type:String,
        required:true
    },
    returnDate:{
        type:String,
        required:false
    },
    pickupTime:{
        type:String,
        required:false
    },
    dropTime:{
        type:String,
        required:false
    },
    packageValue:{
        type:String,
        required:false
    }
})

const cabBookCollection=mongoose.model("cabBookCollection",cabBookSchema);

export default cabBookCollection;