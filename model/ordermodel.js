import mongoose from "mongoose";

const orderschema=mongoose.Schema({
    userid:{
        type:String,
    },
    productid:{
        type:String
    },
    quantity:{
        type:Number
    },
    price:{
        type:Number
    },
    payment_id:{
        type:String
    }
})

export const oredermodel=mongoose.model('ordermodel',orderschema)