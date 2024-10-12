import { prisma } from "../lib/prisma";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

export const addComment = asyncHandler(async(req, res) => {

    const {comment} = req.body
    const id = req.query.id as string

    if (!comment || !id) throw new ApiError(400, "Bad Request")

    const post = await prisma.post.findFirst({
        where: {
            id
        }
    })

    if (!post) throw new ApiError(404, "Invalid post id")
        
    const commentPost = await prisma.comment.create({
        data: {
            comment,
            postId: id,
            userId: req.userId
        }
    })

    res.status(200).json(new ApiResponse(200, commentPost, "Comment added"))
})

export const getAllComment = asyncHandler(async (req, res) => {

    const id = req.query.id as string

    if (!id) throw new ApiError(400, "Bad Request")

    const comments = await prisma.comment.findMany({
        where: {
            postId: id
        },
        select: {
            comment: true,
            user: {
                select: {
                    username: true,
                    image: true
                }
            }
        }
    })

    res.status(200).json(new ApiResponse(200, comments, "Post comments"))
})

export const getMyComments = asyncHandler(async (req, res) => {

    const comments = await prisma.comment.findMany({
        where: {
            userId: req.userId
        },
        select: {
            id: true,
            comment: true,
            post: {
                select: {
                    id: true,
                    title: true,
                    subtitle: true,
                    image: true,
                    _count: {
                        select: {
                            Like: true,
                            Comment: true
                        }
                    }
                }
            }
        }
    })

    res.status(200).json(new ApiResponse(200, comments, "User comments"))
})

export const deleteComment = asyncHandler(async (req, res) => {

    const id = req.params.id as string

    if (!id) throw new ApiError(400, "Bad Request")

    const comment = await prisma.comment.delete({
        where: {
            id,
            userId: req.userId
        }
    })
    res.status(200).json(new ApiResponse(200, comment, "Comment deleted"))
})