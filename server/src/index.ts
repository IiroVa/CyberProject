import { Request, Response, Router } from "express";
import {Book, IBook} from './models/Book'





const router: Router = Router();

router.post("/api/book", async function(req: Request, res: Response){
    try{
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

export default router;
