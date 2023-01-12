"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class Statement extends objection_1.Model {
    static get tableName() {
        return 'statement';
    }
}
exports.default = Statement;
