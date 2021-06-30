import StokDAO from "../dao/stokDAO.js"

export default class StokController {
    static async apiPostStok(req, res, next) {
        try{
            const tokoID = req.body.toko_id
            const dorayakiID = req.body.dorayaki_id
            const stokNum = req.body.stok_num
            const date = new Date()

            if (stokNum < 0) {
                throw new Error("Only Positive Numbers",); 
            } 
            
            const stokResponse = await StokDAO.addStok(
                tokoID,
                dorayakiID,
                stokNum,
                date,
            )
            res.json({ status: "success"})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateStok(req, res, next) {
        try{
            const stokId = req.body.stok_id
            const stokNum = req.body.stok_num
            const date = new Date()

            if (stokNum < 0) {
                throw new Error("Only Positive Numbers",); 
            } 

            const stokResponse = await StokDAO.updateStok(
                stokId,
                stokNum,
                date,
            )

            var {error} = stokResponse
            if (error) {
                res.status(400).json({ error })
            }

            if (stokResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review",
                )
            }

            res.json({ status: "success" })
        } catch(e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteStok(req, res, next) {
        try {
            const stokId = req.query.id
            console.log(stokId)
            const stokResponse = await StokDAO.deleteStok(
                stokId,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}