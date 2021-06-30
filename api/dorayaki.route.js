import express from "express"
import DorayakiCtrl from "./dorayaki.controller.js"

const router = express.Router()

router.route("/").get(DorayakiCtrl.apiGetDorayaki)
router.route("/id/:id").get(DorayakiCtrl.apiGetDorayakiById)
router.route("/id/:id/update").put(DorayakiCtrl.apiUpdateDorayaki)
router.route("/id/:id/delete").delete(DorayakiCtrl.apiDeleteDorayaki)

// create new Dorayaki
router.route("/add").post(DorayakiCtrl.apiPostDorayaki)

export default router