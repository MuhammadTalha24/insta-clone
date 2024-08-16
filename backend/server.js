import express, { urlencoded } from 'express'
import env from "dotenv"
import cookieParser from 'cookie-parser'
import cors from "cors"
import dbConnection from './db/dbConnection.js'

env.config()

const app = express()
const PORT = process.env.PORT || 5000


app.get('/', (req, res) => {
    res.status(200).json({
        message: "I am comming from backend"
    })
})
//Middlewares
app.use(express.json())
app.use(urlencoded({ extended: true }))
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}

app.use(cors(corsOptions))
app.use(cookieParser())

dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server Running At ${PORT}`)
    })
})
