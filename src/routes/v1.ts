import { Router } from "express";
import { isLoggedIn, isLoggedInAdmin } from "../middleware";
import { loginUserPut, loginUserGet, createUserPost, recoverUserPost, recoverPasswordUserPost } from "../controller/";
import { adminCreateUserPost, adminLoginUserPut } from "../controller/admin"


const router = Router();


router.route("/").post( (req, res) => { return res.json({ message: "Success"}) }).get(isLoggedIn, (req, res) => { return });
router.route("/account").post(createUserPost).put(loginUserPut).get(isLoggedIn, loginUserGet);
router.route("/account/recover-password").post(recoverUserPost).put(recoverPasswordUserPost).get(isLoggedIn, loginUserGet);
router.route("/admin/account").post(adminCreateUserPost).put(adminLoginUserPut).get(isLoggedIn, loginUserGet);


export default router;