import { Router } from "express";
import { isLoggedIn } from "../middleware";
import { loginUserPut, loginUserGet, createUserPost, creditAccount, transferAccount, withdrawAccount } from "../controllers";


const router = Router();

router.route("/transaction").post(isLoggedIn, creditAccount).patch(isLoggedIn, transferAccount).put(isLoggedIn, withdrawAccount);
router.route("/account").post(createUserPost).put(loginUserPut).get(isLoggedIn, loginUserGet);
router.route("/logout").get(isLoggedIn, ((req, res) => {
    res.json({ message: "logout" })
}));

export default router;