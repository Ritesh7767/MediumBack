import express, { NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import {v2 as cloudinary} from 'cloudinary'
import path from 'path'

const app = express()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

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

// import { Request, Response } from 'express'
// import ApiError from './utils/apiError'

// app.use((error: Error, req: Request, res: Response) => {

//     if (error instanceof ApiError){
//         const response = {
//             status: error.status,
//             message: error.message,
//             data: error.data,
//             stack: error.stack,
//             success: false
//         }

//         return res.status(error.status).json(response)
//     }
//     res.status(500).json({
//         status: 500,
//         message: "Internal Server Error",
//         data: [],
//         stack: "",
//         success: false
//     })
// })


export default app