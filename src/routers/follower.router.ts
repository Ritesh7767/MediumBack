import { Router } from "express";
import { follow, getFollowers, stopFollowing } from "../controllers/follower.controller";
const router = Router()

router.route("/").post(follow).get(getFollowers).delete(stopFollowing)

export default router
