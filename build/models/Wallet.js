"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Wallet extends objection_1.Model {
    static get tableName() {
        return 'wallet';
    }
}
exports.default = Wallet;
