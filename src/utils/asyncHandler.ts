import { Request, Response, NextFunction } from "express";

const asyncHandler = (func: (req: Request, res: Response) => {}) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await func(req, res)
    } catch (error) {
        next(error)
    }
}

export default asyncHandler