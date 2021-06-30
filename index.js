import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import TokoDAO from "./dao/tokoDAO.js"
import DorayakiDAO from "./dao/dorayakiDAO.js"
import StokDAO from "./dao/stokDAO.js"
dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.STOKDORAYAKI_DB_URI,
    {
        poolSize: 15,
        wtimeout: 2500,
        useNewUrlParse: true }
    )
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client =>{
        await TokoDAO.injectDB(client)
        await DorayakiDAO.injectDB(client)
        await StokDAO.injectDB(client) 
        app.listen(port, () =>{
            console.log(`listening on port ${port}`)
        })
    })