"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.route("/transaction").post(middleware_1.isLoggedIn, controllers_1.creditAccount).patch(middleware_1.isLoggedIn, controllers_1.transferAccount).put(middleware_1.isLoggedIn, controllers_1.withdrawAccount);
router.route("/account").post(controllers_1.createUserPost).put(controllers_1.loginUserPut).get(middleware_1.isLoggedIn, controllers_1.loginUserGet).get(middleware_1.isLoggedIn, controllers_1.checkUserBalance);
router.route("/logout").get(middleware_1.isLoggedIn, ((req, res) => {
    res.json({ message: "logout" });
}));
exports.default = router;
