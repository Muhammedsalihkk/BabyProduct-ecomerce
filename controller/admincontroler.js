import { Cartmodel } from "../model/Cartmodel.js"
import { oredermodel } from "../model/ordermodel.js"
import product from "../model/productmodel.js"
import User from "../model/usermodel.js"

export const getallusers=async(req,res)=>{
    const users=await User.find({isadmin:false})
    res.status(200).json({users})
}
export const getuserdetails=async(req,res)=>{
   try{    
    const user=await User.findById(req.query.id)
    const cartproduct = await Cartmodel.aggregate([
                {
                    $match: { userid: req.query.id }
                }, {
                    $addFields: { product_id: { $toObjectId: "$product" } }
                }
                , {
                    $lookup: {
                        from: "products",
                        localField: "product_id",
                        foreignField: '_id',
                        as: "cartitems"
                    }
                },
                {
                    $unwind: "$cartitems"
                }
            ]) 
    const orders= await oredermodel.aggregate([
                {$match:{userid:req.query.id}},
                {$addFields:{product_id:{$toObjectId:'$productid'}}},
                {$lookup:{
                    from:'products',
                    localField:'product_id',
                    foreignField:'_id',
                    as:'orderdata'
                }},
                {$unwind:'$orderdata'}
            ]) 
        res.status(200).json({user,orders,cartproduct})
   }
   catch(err)
   {
    res.status(500).json({error:err})
   }
}
export const deleteproduct=async(req,res)=>{
    try{
        const status=await product.findByIdAndDelete(req.query.id)
        res.status(200).json({status})
    }
    catch(error){
        res.status(500).json({error})
    }
} 
export const userblocking=async(req,res)=>{
   try{
     const user=await User.findById(req.query.id)
     const blockeduser=await User.findByIdAndUpdate(req.query.id,{$set:{blocked:!user.blocked}})
    console.log(blockeduser);
    
    res.status(200).json({blockeduser})  
   }
   catch(error){
    res.status(500).json({error})
   }
}
export const getallorders=async(req,res)=>{
   try{
     const orders=await oredermodel.find()
    res.status(200).json(orders)
   }
   catch(err){
    res.status(500).json({error:err})
   }
}
