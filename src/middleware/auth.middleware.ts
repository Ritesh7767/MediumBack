import { Request, Response, NextFunction } from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
import ApiError from '../utils/apiError'

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken
        const userData = jwt.verify(token, `${process.env.ACCESS_SECRET}`) as JwtPayload
        console.log(userData, )
        req.userId = userData.id
        next()
    } catch (error) {
        throw new ApiError(402, "Unauthorized Request")
    }
}