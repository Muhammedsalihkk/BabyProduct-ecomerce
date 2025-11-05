import dotenv from 'dotenv'
dotenv.config()
import express, { urlencoded } from 'express'
import userrouter from './router/userrouter.js'
import  productrouter from './router/productrouter.js'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import adminrouter from './router/adminrouter.js'


const app=express()

const port=process.env.DB_PORT
mongoose.connect(port)
.then(()=>{
    console.log("db conncetd")
})
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5174',
    credentials:true
}))
app.use(cookieParser())
app.use('/user',userrouter)
app.use('/product',productrouter)
app.use('/admin',adminrouter)
app.listen(2000)
