import { connect } from "mongoose"
import {DB_CONFIG} from "./database.config.js"

export const initDb = async()=>{
    try{
        await connect(DB_CONFIG.DB_URL)
        console.log("MongoDb connectiuon succeessfule")
    }
    catch(err){
        console.log("MongoDb connectiuon Fail",err)

    }
}