import { Router } from "express";
import { createPost, deletePost, getDetailPost, getDraft, getFollowingPost, getMyPost, getPost, getTopics, publishPost, updatePost } from "../controllers/post.controller";
import { Auth } from "../middleware/auth.middleware";
import { uploads } from "../config/multer.config";

const router = Router()

router.route("/").get(Auth, getMyPost).post(Auth, uploads.single("image"), createPost).patch(Auth, updatePost).delete(Auth, deletePost)
router.route('/draft').get(Auth, getDraft)
router.route('/postDetail').get(getDetailPost)
router.route("/publish").post(Auth, publishPost)
router.route("/get").get(getPost)
router.route("/topic/:id").get(getTopics)
router.route("/getFollowingPost").get(getFollowingPost)

export default router