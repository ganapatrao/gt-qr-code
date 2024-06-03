import express from "express"
import 'dotenv/config' 
let app = express()

app.use(express.json())

app.get("/",(req,res)=>{
    res.send({message:"Welcome ot Profiler"})

})

app.listen(4000,()=>{
    console.log('server is running on port 4000')
})