"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const ioredis_1 = __importDefault(require("ioredis"));
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./src/config/swagger"));
const cors_1 = __importDefault(require("cors")); // 👈 add this
dotenv_1.default.config();
const app = (0, express_1.default)();
// ⚠️ Dev-only: allows any origin
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 4000;
async function bootstrap() {
    try {
        const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/test';
        await mongoose_1.default.connect(mongoUrl);
        console.log('Mongo connected');
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        const redis = new ioredis_1.default(redisUrl);
        redis.on('connect', () => console.log('Redis connected'));
        redis.on('error', err => console.error('Redis error', err));
        app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
        app.use('/api', routes_1.default);
        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        });
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
bootstrap();
