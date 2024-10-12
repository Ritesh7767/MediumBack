import { Router } from "express";
import { addPost, deletePost, getPostByCategory } from "../controllers/hsl.controller";
import { Auth } from "../middleware/auth.middleware";
const router = Router()

router.route("/:category").get(Auth, getPostByCategory).post(Auth, addPost).delete(Auth, deletePost)

export default router