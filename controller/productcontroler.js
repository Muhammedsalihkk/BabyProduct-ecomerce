import {v2 as cloudinary} from 'cloudinary'
import product from '../model/productmodel.js'
import dotenv from 'dotenv'


dotenv.config()
    cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})
export const Addproducts=(req,res)=>{

        console.log(req.body);
        
        const {name,price,disccount,color,category,type,description}=req.body
        cloudinary.uploader.upload(req.file.path,{tags:'product'},async(err,result)=>{
            if(err)
            {
                return res.status(500).json({error:err+"file uploading accuring problem"})
            }
            const imageurl=result.secure_url
            try{
                await product.create({name,image:imageurl,price,disccount,color,category,type,description})
                res.status(201).json({message:"product successfully added"})
            }
            catch(err){
                res.status(500).json({error:"problem accuring store data in mongodb"})
            }
        })
}
export const getproduct=async(req,res)=>{
    try{
        const query=req.query.data
        console.log(query);
        const limit=parseInt(req.query.limit)||0
        const page=parseInt(req.query.page)||1
        const skip=(page-1)*limit
        if(query)
        {
            
            const products=await product.find({$or:[{name:{$regex:query,$options:"i"}},{type:{$regex:query,$options:"i"}},{color:{$regex:query,$options:"i"}},{category:{$regex:query,$options:"i"}}]})
            console.log(product);
            
            res.status(200).json(products)
        }
        else{
            const products=req.query.id?await product.findById(req.query.id):await product.find().skip(skip).limit(limit)
            res.status(200).json(products)
        }
        
        
    }
    catch(err){
        res.status(500).json({error:"faild to fetch product"})
    }
}
export const editproduct=async(req,res)=>{
    
    
    
    if(req.file)
    {
          cloudinary.uploader.upload(req.file.path,{tags:'product'},async(err,result)=>{
            if(err)
            {
                return res.status(500).json({error:err+"file uploading accuring problem"})
            }
            const imageurl=result.secure_url
            try{
                const updtaedproduct=await product.findByIdAndUpdate(req.query.productid,{$set:{...req.body,image:imageurl}},{new:true})
                console.log(updtaedproduct);
                
                res.status(201).json(updtaedproduct)
            }
            catch(err){
                res.status(500).json({error:"problem accuring store data in mongodb"})
            }
        })
    }
    else{
         try{
                const updtaedproduct=await product.findByIdAndUpdate(req.query.productid,{$set:req.body},{new:true})
                console.log(updtaedproduct);
                
                res.status(201).json(updtaedproduct)
            }
            catch(err){
                console.log(err);
                
                res.status(500).json({error:"problem accuring store data in mongodb"})
            }
    }
}