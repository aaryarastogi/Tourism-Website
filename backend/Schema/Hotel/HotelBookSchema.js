import mongoose from "mongoose";

const hotelBookSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    location:{       
        type:String,
        required:true
    },
    checkinDate:{
        type:String,
        required:true
    },
    checkoutDate:{
        type:String,
        required:true
    },
    rooms:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    }
})

const hotelBookCollection=mongoose.model("hotelBookCollection",hotelBookSchema);

export default hotelBookCollection;