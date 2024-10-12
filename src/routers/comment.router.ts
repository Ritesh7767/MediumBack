import { Router } from "express";
import { addComment, deleteComment, getAllComment, getMyComments } from "../controllers/comment.controller";
import { Auth } from "../middleware/auth.middleware";

const router = Router()

router.route("/getMine").get(Auth, getMyComments)
router.route("/").get(getAllComment).post(Auth, addComment).delete(Auth, deleteComment)

export default router