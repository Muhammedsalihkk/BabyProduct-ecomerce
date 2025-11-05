import User from "../model/usermodel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Cartmodel } from "../model/Cartmodel.js"
import { oredermodel } from "../model/ordermodel.js"
import razorpayInstance from "../Razorpay.js" 

export const userlogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ error: "fill all the colums" })
    }
    const user = await User.findOne({ email })
    console.log((user==null));
    
    if (!user) {
        res.status(400).json({ error: "user not exist" })
        return 0
    }
    if(user.blocked)
    {
        res.status(403).json({error:"you are restitrcted from admin"})
    }
    else {
        const ismatch = await bcrypt.compare(password, user.password)

        if (ismatch) {
            const token = jwt.sign({
                id: user.id, admin: user.isadmin
            },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,

            })
            res.status(201).json({ Admin: user.isadmin })
        }
        else {
            res.status(400).json({ error: "the password not match" })
        }
    }

}
export const userregister = async (req, res) => {
    const { name, email, password, confirmpassword, isadmin, blocked } = req.body
    const emailfind = await User.findOne({ email })
    if (!name || !email || !password || !confirmpassword) {
        res.status(400).json({ error: "Please complete all colums" })
    }
    else if (password != confirmpassword) {

        res.status(400).json({ error: "password not match" })
    }
    else if (emailfind) {
        res.status(400).json({ error: "email must be unique" })
    }
    else {
        const hashedpassword = await bcrypt.hash(password, 10)
        await User.create({ name, email, password: hashedpassword, isadmin, blocked })
        res.status(201).json({ message: "created successfully" })
    }
}
export const userprofile = async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        res.status(200).json(user)
    }
    else {
        res.status(401).json({ error: "not found" })
    }
}
export const userlogout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true
    })
    res.status(200).json({ message: "logout successfully" })
}
export const addtocart = async (req, res) => {
    try {
        if (req.body.id) {
            await Cartmodel.create({ userid: req.user.id, product: req.body.id, quantity: 1 })
            res.status(200).json({ message: "product added successfully" })
        }

    }
    catch (error) {
        
        res.status(500).json({error:"can add the product to cart"})
    }
}
export const cartitems = async (req, res) => {
    try {
        const cartproduct = await Cartmodel.aggregate([
            {
                $match: { userid: req.user.id }
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
        
        res.status(200).json({ cart: cartproduct })
    }
    catch (err) {
        res.status(500).json({ error: "cant get the data from database" })
    }
}

export const checkcart = async (req, res) => {
    try {
        const cartproduct = await Cartmodel.findOne({ userid: req.user.id, product: req.query.id })
        if (cartproduct) {
            res.status(409).json({ message: 'produt already in cart',userid:req.user.id})
        }
        else{
            res.status(200).json({message:"product not in the cart "})
        }
    }
    catch (error) {
        res.status(500).json({ error: "database is down"})
    }
}
export const removeitemfromcart=async(req,res)=>{
    
    try{
        if(!req.query.id)
        {
            res.status(400).json({error:"product id is required"})
        }
        else{
              const status=await Cartmodel.deleteOne({userid:req.user.id,product:req.query.id})
        if(status.deletedCount==0)
        {
            res.status(404).json({error:"not found the product with the id"})
        }
        else{
             res.status(200).json({message:"removed item"})
        }
        }
       
    }
    catch(err)
    {
       
        res.status(500).json({error:"cant remove item from cart"})
       
    }

}
export const updatequantity=async(req,res)=>{
    try{
       if(req.body.quantity>0)
       {
         await Cartmodel.updateOne({userid:req.user.id,product:req.query.id},
        {$set:{quantity:req .body.quantity}}
        )
    res.status(200).json({message:"quantity updated"})
       }
       else{
        res.status(404).json({error:"invalied quantity"})
       }
    }
    catch(err)
    {
        res.status(500).json({error:"problem accuring in database"})
    }
}

export const payment=async(req,res,next)=>{
    try{   
        const amount=req.body.amount
        const options={
        amount:amount*100,
        currency:"INR"
    }
    const order=await razorpayInstance.orders.create(options)
    req.payment_id=order.id
     next()
    }
    catch(err){
        res.status(500).json({error:"payment problem"})
    }  
} 

export const addtoorder=async(req,res)=>{
        const {items}=req.body
        
            
            for(let i of items )
            {
                const quantity = i.quantity || 1;
                const price =  i.quantity?i.cartitems.price*i.quantity:i.price  
                const id=i.quantity?i.product:i._id
               await oredermodel.create({userid:req.user.id,productid:id,quantity:quantity,price:price,payment_id:req.payment_id})
               await Cartmodel.deleteOne({userid:req.user.id,product:id})
            }
            res.status(200).json({message:"payment successfully competed"})
        
      
        
}     
export const getorders=async(req,res)=>{
  try{

    const orders= await oredermodel.aggregate([
        {$match:{userid:req.user.id}},
        {$addFields:{product_id:{$toObjectId:'$productid'}}},
        {$lookup:{
            from:'products',
            localField:'product_id',
            foreignField:'_id',
            as:'orderdata'
        }},
        {$unwind:'$orderdata'}
    ])
    console.log(orders);
    
    res.status(200).json({orders}||{message:"no orderfound"})
  }
  catch(err){
    res.status(500).json({err})
  }
}