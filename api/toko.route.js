import express from "express"
import TokoCtrl from "./toko.controller.js"
import StokCtrl from "./stok.controller.js"

const router = express.Router()

router.route("/").get(TokoCtrl.apiGetToko)
router.route("/id/:id").get(TokoCtrl.apiGetTokoById)
router.route("/id/:id/update").put(TokoCtrl.apiUpdateToko)
router.route("/id/:id/delete").delete(TokoCtrl.apiDeleteToko)

// create new toko
router.route("/add").post(TokoCtrl.apiPostToko)

// CRUD stok
router
    .route("/stok")
    .post(StokCtrl.apiPostStok)
    .put(StokCtrl.apiUpdateStok)
    .delete(StokCtrl.apiDeleteStok)

// transfer stok
//route.route("/trfstok").post(StokCtrl.apiPostTrfStok)

export default router