"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("../config/env"));
let connection = null;
async function connectMongo() {
    if (!connection) {
        const uri = env_1.default.mongoUri || 'mongodb://localhost:27017/test';
        connection = await mongoose_1.default.connect(uri);
    }
    return connection;
}
exports.default = connectMongo;
