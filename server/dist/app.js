"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./src/index"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = 1234;
const mongoDB = "mongodb://127.0.0.1:27017/cybersecuritydb";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
app.use(express_1.default.json());
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/user", index_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
