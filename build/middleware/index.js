"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedInAdmin = exports.isLoggedIn = void 0;
const auth_1 = require("./auth");
Object.defineProperty(exports, "isLoggedIn", { enumerable: true, get: function () { return auth_1.isLoggedIn; } });
Object.defineProperty(exports, "isLoggedInAdmin", { enumerable: true, get: function () { return auth_1.isLoggedInAdmin; } });
