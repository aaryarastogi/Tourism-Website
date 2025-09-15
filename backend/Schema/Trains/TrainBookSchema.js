import mongoose from "mongoose";

const trainBookSchema=new mongoose.Schema({
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
    travelDate:{
        type:String,
        required:true
    },
    trainNumber:{
        type:String,
        required:true
    },
    seatingClass:{
        type:String,
        required:true
    },
})

const trainBookCollection=mongoose.model("trainBookCollection",trainBookSchema);

export default trainBookCollection;