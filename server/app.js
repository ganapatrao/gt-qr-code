import express from "express"
import 'dotenv/config' 
import {initDb} from "./services/database/database.service.js"
import {APP_PORT} from "./config.js"
let app = express()

//DB connection
initDb();

app.use(express.json())

app.get("/",(req,res)=>{
    res.send({message:"Welcome ot Profiler"})

})

app.listen(APP_PORT,()=>{
    console.log('server is running on port 4000')
})