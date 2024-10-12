import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import { postType, postValidation } from "../zod/post.zod";
import ApiResponse from "../utils/apiResponse";
import { prisma } from "../lib/prisma";
import { PrismaClient } from "@prisma/client/extension";
import uploadToCloudinary from "../utils/cloudinary";

export const createPost = asyncHandler(async (req, res) => {

    const {title, content, subtitle, image}: postType = req.body

    if (!postValidation.safeParse(req.body).success) throw new ApiError(401, "Invalid data provided")
        
    let imageUrl
    const filepath = req.file?.path

    if (filepath){
        imageUrl = await uploadToCloudinary(filepath)
    }

    const post = await prisma.post.create({
        data: {
            title,
            subtitle,
            content,
            image: imageUrl,
            date: new Date(),
            userId: req.userId
        }
    })

    res.status(201).json(new ApiResponse(201, post, "Post created successfully"))
})

export const getDraft = asyncHandler(async (req, res) => {

    const post = await prisma.post.findMany({
        where: {
            userId: req.userId,
            published: false
        },
        select: {
            id: true,
            title: true,
            subtitle: true,
            image: true
        }
    })

    res.status(200).json(new ApiResponse(200, post))
})

export const getMyPost = asyncHandler(async (req, res) => {

    console.log(req.userId)
    const post = await prisma.post.findMany({
        where: {
            userId: req.userId,
            published: true
        }
    })

    res.status(200).json(new ApiResponse(200, post, "User Posts"))
})

export const getDetailPost = asyncHandler(async (req, res) => {

    const id = req.params.id
    if (!id) throw new ApiError(400, "Bad Request")

    const post = await prisma.post.findUnique({
        where: {
            id
        },
        include: {
            user: {
                select: {
                    username: true,
                    image: true,
                }
            },
            _count: {
                select: {
                    Like: true,
                    Comment: true
                }
            }
        }
    })

    if (!post) throw new ApiError(404, "Post does not exist")
    res.status(200).json(new ApiResponse(200, post))
})

export const publishPost = asyncHandler(async (req, res) => {

    const id = req.query.id as string
    const {topic} = req.body

    if (!id) throw new ApiError(400, "Bad Request")

    const currentPost = await prisma.post.findUnique({
        where: {
            id,
            userId: req.userId
        }
    })

    if (!currentPost) throw new ApiError(400, "Bad Request")
    
    const publishedPost = await prisma.post.update({
        where: {
            id
        },
        data: {
            published: !currentPost.published,
            topic
        }
    })

    res.status(201).json(new ApiResponse(201, publishedPost))
})

export const getPost = asyncHandler(async (req, res) => {

    const post = await prisma.post.findMany({
        where: {
            published: true
        },
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
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    image: true,
                    description: true,
                    _count: {
                        select: {
                            Following: true
                        }
                    }
                }
            }
        }
    })
    res.status(200).json(new ApiResponse(200, post))
})

export const getTopics = asyncHandler(async (req, res) => {

    const id = req.params.limit

    const limit = Number(id)
    if (!limit) throw new ApiError(401, "Bad Request")

    const topics = await prisma.post.findMany({
        take: limit,
        select: {
            topic: true
        }
    })
    res.status(200).json(new ApiResponse(200, topics))
})

export const getFollowingPost = asyncHandler(async (req, res) => {

    const posts = await prisma.following.findMany({
        where: {
            followerId: req.userId,
        },
        select: {
            following: {
                select: {
                    image: true,
                    username: true,
                    post: {
                        where: {
                            published: true
                        },
                        select: {
                            image: true,
                            title: true,
                            subtitle: true,
                            date: true,
                            _count: {
                                select: {
                                    Like: true,
                                    Comment: true
                                }
                            }
                        }   
                    }
                }
            }
        }
    })

    res.status(200).json(new ApiResponse(200, posts, "Following's posts"))
})

export const updatePost = asyncHandler(async (req, res) => {

    const id = req.query.id as string
    if (!id) throw new ApiError(400, "Bad Request")

    const {title, subtitle, content, image} = req.body
    if (!postValidation.safeParse(req.body).success) throw new ApiError(400, "Invalid data provided")

    const post = await prisma.post.update({
        where: {
            id,
            userId: req.userId
        },
        data: {
            title, subtitle, content, image
        }
    })

    res.status(200).json(new ApiResponse(200, post, "Post Updated"))
})

export const deletePost = asyncHandler(async (req, res) => {

    const id = req.query.id as string
    if (!id) throw new ApiError(400, "Bad Request")

    const post = await prisma.post.delete({
        where: {
            id,
            userId: req.userId
        }
    })
    
    res.status(200).json(new ApiResponse(200, post, "Post deleted"))
})
