import DorayakiDAO from "../dao/dorayakiDAO.js"

export default class DorayakiController {
    static async apiGetDorayaki(req, res, next) {
        const dorayakiPerPage = req.query.dorayakiPerPage ? parseInt(req.query.dorayakiPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.rasa) {
            filters.rasa = req.query.rasa
        }

        const { dorayakiList, totalNumDorayaki } = await DorayakiDAO.getDorayaki({
            filters,
            page,
            dorayakiPerPage,
        })

        let response = {
            dorayaki: dorayakiList,
            page: page,
            filters: filters,
            entries_per_page: dorayakiPerPage,
            total_result: totalNumDorayaki,
        }
        res.json(response)
    }

    static async apiGetDorayakiById(req, res, next) {
        try {
            let id = req.params.id || {}
            let dorayaki = await DorayakiDAO.getDorayakiById(id)
            if(!dorayaki) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(dorayaki)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiUpdateDorayaki(req, res, next) {
        try {
            let dorayakiId = req.params.id || {}
            const rasa = req.body.rasa
            const deskripsi = req.body.deskripsi
            const date = new Date()

            const dorayakiResponse = await DorayakiDAO.updateDorayaki(
                dorayakiId,
                rasa,
                deskripsi,
                date,
            )

            var {error} = dorayakiResponse
            if (error) {
                res.status(400).json({ error })
            }

            if (dorayakiResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update dorayaki",
                )
            }
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteDorayaki(req, res, next) {
        try {
            let dorayakiId = req.params.id || {}
            console.log(dorayakiId)
            const dorayakiResponse = await DorayakiDAO.deleteDorayaki(
                dorayakiId,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiPostDorayaki(req, res, next) {
        try {
            const rasa = req.body.rasa
            const deskripsi = req.body.deskripsi
            const date = new Date()

            const stokResponse = await DorayakiDAO.addDorayaki(
                rasa,
                deskripsi,
                date,
            )
            res.json({ status: "success"})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}