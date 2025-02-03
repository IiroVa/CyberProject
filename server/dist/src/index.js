"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Book_1 = require("./models/Book");
const router = (0, express_1.Router)();
router.post("/api/book", async function (req, res) {
    try {
        console.log("HERE");
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
router.get("/api/books/:name", async function (req, res) {
    try {
        console.log("1HERE");
        let bookname = req.params.name;
        console.log("2HERE" + bookname);
        let theBook = await Book_1.Book.findOne({ name: bookname });
        if (theBook) {
            res.status(200).json({ data: theBook });
        }
        else {
            res.status(400).json({ message: "No book found." });
        }
    }
    catch (error) {
        console.error(`Error occur: ${error}`);
    }
});
exports.default = router;
