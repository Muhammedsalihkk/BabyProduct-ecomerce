import express from 'express'
import { Addproducts,getproduct } from '../controller/productcontroler.js'
import multer from 'multer'
import path from 'path'
import { adminsonly, verifytoken } from '../authmiddleware.js'
const productrouter=express.Router()




productrouter.get('/getproduct',getproduct)
export default productrouter