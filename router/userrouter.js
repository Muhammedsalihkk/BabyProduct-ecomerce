import express from 'express'
import { userlogin, userregister,userprofile,userlogout,addtocart,cartitems, checkcart, removeitemfromcart, updatequantity, addtoorder, payment, getorders } from '../controller/usercontroler.js'
import { verifytoken } from '../authmiddleware.js'
const userrouter=express.Router()
userrouter.post('/userlogin',userlogin)
userrouter.post('/register',userregister)
userrouter.get('/profile',verifytoken,userprofile)
userrouter.get('/logout',verifytoken,userlogout)
userrouter.get('/cart',verifytoken,cartitems)
userrouter.delete('/cart/removeitem',verifytoken,removeitemfromcart)
userrouter.patch('/cart/updatequantity',verifytoken,updatequantity)
userrouter.get('/checkcart',verifytoken,checkcart)
userrouter.patch('/addtocart',verifytoken,addtocart)
userrouter.post('/addtoorder',verifytoken,payment,addtoorder)
userrouter.get('/getorders',verifytoken,getorders)

export default userrouter