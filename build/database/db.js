"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("./knexfile"));
const objection_1 = require("objection");
const config_1 = require("../config");
console.log(config_1.config.RUNTIME);
const dbConfig = knexfile_1.default[config_1.config.RUNTIME || 'development'];
const db = (0, knex_1.default)(dbConfig);
objection_1.Model.knex(db);
exports.default = db;
