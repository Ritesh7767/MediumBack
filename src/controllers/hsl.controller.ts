import { PrismaClient } from "@prisma/client/extension";
import { prisma } from "../lib/prisma";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

export const addPost = asyncHandler(async (req, res) => {

    const id = req.query.id as string
    const category = req.params.category

    if (!id || !category) throw new ApiError(400, "Bad Request")
    
    const validPost = await prisma.post.findFirst({
        where: {
            id
        }
    })

    if (!validPost) throw new ApiError(404, "Invalid post id")

    let model: PrismaClient["history"] | PrismaClient["save"] | PrismaClient["like"]
    if (category == "history") model = prisma.history
    else if (category == "save") model = prisma.save
    else if (category == "like") model = prisma.like
    else throw new ApiError(400, "Bad Ritesh")

    const existingPost = await model.findUnique({
        where: {
            userId_postId: {
                userId: req.userId,
                postId: id
            }
        }
    })

    if (existingPost) throw new ApiError(401, `Post already in ${category}`)

    const post = await model.create({
        data: {
            userId: req.userId,
            postId: id
        }
    })
    res.status(200).json(new ApiResponse(200, post))
})

export const getPostByCategory = asyncHandler(async (req, res) => {

    const category = req.params.category

    let model: PrismaClient["save"] | PrismaClient["history"] | PrismaClient["like"]
    if (category == "save") model = prisma.save
    else if (category == 'history') model = prisma.history
    else if (category == "like") model = prisma.like
    else throw new ApiError(400, "Invalid Request") 

    let post = await model.findMany({
        where: {
            userId: req.userId
        },
        select: {
            id: true,
            post: {
                select: {
                    id: true,
                    title: true,
                    subtitle: true,
                    image: true,
                    date: true,
                    _count: {
                        select: {
                            Like: true,
                            Comment: true
                        }
                    }
                }
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    image: true,
                    description: true
                }
            }
        }
    })
    res.status(200).json(new ApiResponse(200, post))
})

export const deletePost = asyncHandler(async (req, res) => {

    try {
        const id = req.query.id as string
        const category = req.params.category
        
        if (!id || !category) throw new ApiError(401, "Bad Request")
            
        let model: PrismaClient["history"] | PrismaClient["save"] | PrismaClient["like"]
        
        if (category == "history") model = prisma.history
        else if (category == "save") model = prisma.save
        else if (category == "like") model = prisma.like
        else throw new ApiError(400, "Bad Ritesh")
        
        console.log("ritesh")
        const post = await model.delete({
            where: {
                id,
                userId: req.userId
            }
        })

        res.status(200).json(new ApiResponse(200, post))

    } catch (error) {
        throw new ApiError(402, "Bad Request")    
    }
})
