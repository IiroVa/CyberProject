"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Book_1 = require("./models/Book");
const router = (0, express_1.Router)();
router.post("/api/book", async function (req, res) {
    try {
        let data = req.body;
        let newBook = new Book_1.Book({
            name: req.body.name,
            author: req.body.author,
            pages: req.body.pages
        });
        await newBook.save();
        res.status(200).json({ message: "New book added" });
    }
    catch (error) {
        console.error(`Error occur: ${error}`);
    }
});
exports.default = router;
