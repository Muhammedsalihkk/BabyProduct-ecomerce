import mongoose  from "mongoose";

const userschema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    blocked:{
        type:Boolean
    },
    isadmin:{
        type:Boolean
    }
})
const User=mongoose.model('User',userschema)
export default User