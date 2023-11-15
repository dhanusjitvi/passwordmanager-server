import express from "express";
import connectDataBase from "./config/databse/mongo";
import router from "./router/userRoutes/userRoutes";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import cors from 'cors'

const app = express()

app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:4200', 'https://passcraftsman.netlify.app']
    })
);
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))

connectDataBase()

app.use("/api", router)

const port = process.env.PORT

app.listen(port, () => {
    console.log(`The server start at running on port ${port}`);
});