import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import { userInterface, userLogin, userRegister } from "../zod/user.zod";
import bcrypt from 'bcrypt'
import ApiResponse from "../utils/apiResponse";
import jwt from 'jsonwebtoken'
import { prisma } from "../lib/prisma";

const generateAccessToken = ({id, username, email}: {id: string, username: string, email: string} ) => {
    return jwt.sign(
        {
            id, username, email
        },
        `${process.env.ACCESS_SECRET}`,
        {
            expiresIn: process.env.ACCESS_EXPIRY
        }
    )
}

const generateRefreshToken = ({id}: {id: string}) => {
    return jwt.sign(
        {
            id
        },
        `${process.env.REFRESH_SECRET}`,
        {
            expiresIn: process.env.REFRESH_EXPIRY
        }
    )
}

export const register = asyncHandler(async (req, res) => {

    const {username, email, password}: userInterface = req.body
    console.log(username, email, password)
    if (!userRegister.safeParse(req.body).success) throw new ApiError(401, "Invalid data")
    
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{username}, {email}]
        }
    })

    if (existingUser) throw new ApiError(403, "User already exist")

    const hashPassword = await bcrypt.hash(password, 5)
    
    const user = await prisma.user.create({
        data: {
            username,
            email, 
            password: hashPassword,
        },
        select: {
            id: true,
            username: true,
            email: true
        }
    })

    if (!user) throw new ApiError(500, "Something went wrong while registration, please try again")
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.status(201).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse(201, user, "User created successfully"))
})

export const login = asyncHandler(async (req, res) => {

    const {email, password}: userInterface = req.body
    if (!userLogin.safeParse(req.body).success) throw new ApiError(401, "Invalid data")

    const user = await prisma.user.findUnique(
        {
            where: {
                email
            }
        }
    )

    if (!user) throw new ApiError(404, "User does not exist")

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new ApiError(401, "Email or password is incorrect")

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    const result = {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        description: user.description
    }
    res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).json(new ApiResponse(200, result))
})

export const getUsers = asyncHandler(async (req, res) => {
    
    const id = req.params.id

    const limit = Number(id)
    if (!limit) throw new ApiError(401, "Bad Request")
    
    const users = await prisma.user.findMany({
        take: limit,
        select: {
            image: true,
            username: true,
            description: true
        }
    })
    res.status(201).json(new ApiResponse(201, users))
})


