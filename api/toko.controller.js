import TokoDAO from "../dao/tokoDAO.js"

export default class TokoController {
    static async apiGetToko(req, res, next) {
        const tokoPerPage = req.query.tokoPerPage ? parseInt(req.query.tokoPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.jalan) {
            filters.jalan = req.query.jalan
        } else if (req.query.kecamatan) {
            filters.kecamatan = req.query.kecamatan
        } else if (req.query.provinsi) {
            filters.provinsi = req.query.provinsi
        } else if (req.query.nama) {
            filters.nama = req.query.nama
        }

        const { tokoList, totalNumToko } = await TokoDAO.getToko({
            filters,
            page,
            tokoPerPage,
        })

        let response = {
            toko: tokoList,
            page: page,
            filters: filters,
            entries_per_page: tokoPerPage,
            total_result: totalNumToko,
        }
        res.json(response)
    }

    static async apiGetTokoById(req, res, next) {
        try {
            let id = req.params.id || {}
            let toko = await TokoDAO.getTokoById(id)
            if(!toko) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(toko)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiUpdateToko(req, res, next) {
        try {
            let tokoId = req.params.id || {}
            const nama = req.body.nama
            const jalan = req.body.jalan
            const kecamatan = req.body.kecamatan
            const provinsi = req.body.provinsi
            const date = new Date()

            const tokoResponse = await TokoDAO.updateToko(
                tokoId,
                nama,
                jalan,
                kecamatan,
                provinsi,
                date,
            )

            var {error} = tokoResponse
            if (error) {
                res.status(400).json({ error })
            }

            if (tokoResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update toko",
                )
            }
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteToko(req, res, next) {
        try {
            let tokoId = req.params.id || {}
            console.log(tokoId)
            const tokoResponse = await TokoDAO.deleteToko(
                tokoId,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiPostToko(req, res, next) {
        try {
            const nama = req.body.nama
            const jalan = req.body.jalan
            const kecamatan = req.body.kecamatan
            const provinsi = req.body.provinsi
            const date = new Date()

            const stokResponse = await TokoDAO.addToko(
                nama,
                jalan,
                kecamatan,
                provinsi,
                date,
            )
            res.json({ status: "success"})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}