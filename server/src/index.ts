import { Request, Response, Router } from "express";
import {Book, IBook} from './models/Book'





const router: Router = Router();

router.post("/api/book", async function(req: Request, res: Response){
    try{
        console.log("HERE")
        let data = req.body;

        let newBook: IBook = new Book({
            name: req.body.name,
            author: req.body.author,
            pages: req.body.pages

        })
        await newBook.save()
        res.status(200).json({message: "New book added"})


        
        
       

        
    } catch (error: any){
        console.error(`Error occur: ${error}`)
        
    }

})

router.get("/api/books/:name", async function(req: Request, res: Response){
    try{
        console.log("1HERE")
        let bookname: any = req.params.name
        console.log("2HERE" + bookname)

        let theBook = await Book.findOne({name: bookname})

        if(theBook){
            res.status(200).json({data: theBook})
        }else{
            res.status(400).json({message: "No book found."})
        }
        


        
        
       

        
    } catch (error: any){
        console.error(`Error occur: ${error}`)
        
    }

})






export default router;
