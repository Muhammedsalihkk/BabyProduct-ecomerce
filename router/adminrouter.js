import express from 'express'
import { deleteproduct, getallorders, getallusers, getuserdetails, userblocking } from '../controller/admincontroler.js'
import { adminsonly, verifytoken } from '../authmiddleware.js'
import { Addproducts, editproduct } from '../controller/productcontroler.js'
import multer from 'multer'
import path from 'path'

const adminrouter=express.Router()
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./image/')
    },
    filename:function(req,file,cb){
    
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const upload=multer({storage:storage})

adminrouter.get('/getallusers',verifytoken,adminsonly,getallusers)
adminrouter.get('/getuserdetails',verifytoken,adminsonly,getuserdetails)
adminrouter.put('/editproduct',verifytoken,adminsonly,upload.single('image'),editproduct)
adminrouter.post('/productupload',verifytoken,adminsonly,upload.single('image'),Addproducts)
adminrouter.delete('/deleteproduct',verifytoken,adminsonly,deleteproduct)
adminrouter.patch('/blockuser',verifytoken,adminsonly,userblocking)
adminrouter.get('/getalloders',verifytoken,adminsonly,getallorders)



export default adminrouter