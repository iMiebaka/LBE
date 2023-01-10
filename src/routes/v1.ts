import { Router } from "express";
import { isLoggedIn} from "../middleware";
import { loginUserPut, loginUserGet, createUserPost, creditAccount, transferAccount } from "../controllers";


const router = Router();


router.route("/transaction").post(isLoggedIn, creditAccount).patch(isLoggedIn, transferAccount)
router.route("/account").post(createUserPost).put(loginUserPut).get(isLoggedIn, loginUserGet);


export default router;