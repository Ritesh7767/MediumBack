import { Request, Response, NextFunction } from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
import ApiError from '../utils/apiError'

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        console.log(token)
        const userData = jwt.verify(token || "", `${process.env.ACCESS_SECRET}`) as JwtPayload
        req.userId = userData.id
        next()
    } catch (error) {
        console.log(error)
        throw new ApiError(402, "Unauthorized Request")
    }
}