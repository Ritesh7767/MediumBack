import express from 'express'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app = express()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    // origin: "http://localhost:5174",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("health check server")
})

import userRouter from './routers/user.router'
app.use('/api/v1/user', userRouter)

import postRouter from './routers/post.router'
app.use('/api/v1/post', postRouter)

import commentRouter from './routers/comment.router'
app.use("/api/v1/comment", commentRouter)

import followingRouter from './routers/follower.router'
app.use("/api/v1/follower", followingRouter)

import hslRouter from './routers/hsl.router'
app.use('/api/v1', hslRouter)

import { Request, Response, NextFunction } from 'express'
import ApiError from './utils/apiError'

app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    if(err instanceof ApiError){
        res.status(err.status).json({
            status: err.status,
            success : false,
            message : err.message,
            errors : err.stack,
            data : err.data
        })
    }
    else {
        res.status(500).json({
            status: 500,
            success : false,
            message : "Internal Server Error",
            errors : [],
            data : null
        })
    }
})


export default app