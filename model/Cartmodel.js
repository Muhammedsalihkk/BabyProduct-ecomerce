import mongoose from "mongoose";
import product from "./productmodel.js";

const cartSchema=mongoose.Schema({
    userid:{
        type:String,
    },
    product:{
        type:String
    },
    quantity:{
        type:Number
    }
})
export const Cartmodel=mongoose.model('Cartmodel',cartSchema)