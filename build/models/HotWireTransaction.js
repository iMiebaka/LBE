"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class HotWireTransaction extends objection_1.Model {
    static get tableName() {
        return 'hot_wire_transaction';
    }
}
exports.default = HotWireTransaction;
