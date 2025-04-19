"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const token = req.header('authorization')?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied, missing token" });
    }
    else {
        try {
            const verified = jsonwebtoken_1.default.verify(token, process.env.ACCESSTOKENSECRET);
            req.user = verified;
            console.log("verified");
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(403).json({ message: "Token Expired" });
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                console.log('Invalid token!'); // Token ei ole kelvollinen
                res.status(402).json({ message: "Access denied invalid token." });
            }
            else {
                console.log("Internal server error");
                res.status(400).json({ message: "Internal server error" });
            }
        }
    }
};
exports.validateToken = validateToken;
