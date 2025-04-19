import express, {Request, Response, Express} from "express"
import router from "./src/index"
import morgan from "morgan"
import path from "path"
import mongoose, { Connection } from "mongoose";
import cors, {CorsOptions} from 'cors'
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

const app: Express = express();
const port = 1234;


const mongoDB: string = "mongodb://127.0.0.1:27017/cybersecuritydb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error"))


app.use(express.json());
dotenv.config()
app.use(cookieParser());
app.use(morgan("dev"));




app.use("/api/user", router);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
});
