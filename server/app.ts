import express, {Request, Response, Express} from "express"
import router from "./src/index"
import morgan from "morgan"
import path from "path"
import mongoose, { Connection } from "mongoose";
import cors, {CorsOptions} from 'cors'
const app: Express = express();
const port = 1234;


const mongoDB: string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error"))


app.use(express.json());
app.use(morgan("dev"));


app.use(express.static(path.join(__dirname, "../public")))


app.use("/", router);
if(process.env.NODE_ENV === 'development') {
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV==='production') {
    app.use(express.static(path.resolve('../..', 'client', 'build')))
    app.get('*', (req: Request, res: Response)=>{
        res.sendFile(path.resolve('../..', 'client', 'build', 'index.html'))
    })
    
    }
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
});
