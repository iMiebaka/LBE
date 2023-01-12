import { Router } from "express";
import { isLoggedIn } from "../middleware";
import { loginUserPut, loginUserGet, createUserPost, creditAccount, transferAccount, withdrawAccount, checkUserBalance } from "../controllers";


const router = Router();

router.route("/transaction").post(isLoggedIn, creditAccount).patch(isLoggedIn, transferAccount).put(isLoggedIn, withdrawAccount).get(isLoggedIn, checkUserBalance);
router.route("/account").post(createUserPost).put(loginUserPut).get(isLoggedIn, loginUserGet).get(isLoggedIn, checkUserBalance)
router.route("/logout").get(isLoggedIn, ((req, res) => {
    res.json({ message: "logout" })
}));

export default router;