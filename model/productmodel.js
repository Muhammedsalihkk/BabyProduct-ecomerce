import mongoose from "mongoose";
const productshema=mongoose.Schema({
        name:{
            type:String,
            require:true
        },
        image:{
            type:String,
            require:true
        },
        price:{
            type:Number,
            require:true
        },
        disccount:{
            type:String,
            require:true
        },
        color:{
            type:String,
            require:true
        },
        category:{
            type:String,
            require:true
        },
        type:{
            type:String,
            require:true
        },
        description:{
            type:String,
            require:true
        }
})
productshema.index({name:"text",category:"text",color:"text",description:"text",type:"text"})
const product=mongoose.model('product',productshema)
export default product