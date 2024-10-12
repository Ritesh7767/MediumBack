import ApiError from "./apiError"
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

const uploadToCloudinary = async (filepath: string) => {
    const {secure_url} = await cloudinary.uploader.upload(filepath)
    fs.unlinkSync(filepath)
    return secure_url
}

export default uploadToCloudinary