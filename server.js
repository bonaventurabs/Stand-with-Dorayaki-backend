import express from "express"
import cors from "cors"
import toko from "./api/toko.route.js"
import dorayaki from "./api/dorayaki.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/toko", toko)
app.use("/api/v1/dorayaki", dorayaki)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app