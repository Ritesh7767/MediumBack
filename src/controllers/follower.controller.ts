import { prisma } from "../lib/prisma";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

export const follow = asyncHandler(async (req, res) => {

    const id = req.params.id

    if (!id) throw new ApiError(400, "Bad Request")

    const user = await prisma.user.findFirst({
        where: {
            id
        }
    })

    if (!user) throw new ApiError(404, "User does not exist")

    const existingRecord = await prisma.following.findFirst({
        where: {
            followerId: req.userId,
            followingId: id
        }
    })

    if (existingRecord) throw new ApiError(401, "Already following")
    
    const followingDetail = await prisma.following.create({
        data: {
            followerId: req.userId,
            followingId: id
        }
    })

    res.status(201).json(new ApiResponse(201, followingDetail, "Started following"))
})

export const getFollowers = asyncHandler(async (req, res) => {

    const followers = await prisma.following.findMany({
        where: {
            followingId: req.userId
        },
        include: {
            follower: {
                select: {
                    image: true,
                    username: true,
                    description: true
                }
            }
        }
    })

    res.status(200).json(new ApiResponse(200, followers, "Followers list"))
})

export const stopFollowing = asyncHandler(async (req, res) => {

    const id = req.params.id

    if (!id) throw new ApiError(400, "Bad Request")

    const user = await prisma.user.findFirst({
        where: {
            id
        }
    })

    if (!user) throw new ApiError(404, "User does not exist")

    const deleteRecord = await prisma.following.delete({
        where: {
            followerId_followingId: {
                followerId: req.userId,
                followingId: id
            }
        }
    })

    res.status(201).json(new ApiResponse(201, deleteRecord, "Removed from following list"))
})