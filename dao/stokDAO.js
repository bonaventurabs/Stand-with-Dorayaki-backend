import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

let stok

export default class StokDAO {
    static async injectDB(conn) {
        if (stok) {
            return
        }
        try {
            stok = await conn.db(process.env.STOKDORAYAKI_NS).collection("stok")
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`,)
        }
    }

    static async addStok(tokoId, dorayakiId, stokNum, date) {
        try {
            const stokDoc = { 
                toko_id: ObjectId(tokoId),
                dorayaki_id: ObjectId(dorayakiId),
                stok_num: stokNum,
                date: date,
            }
           
            return await stok.insertOne(stokDoc)
        } catch (e) {
            console.error(`Unable to post stok: ${e}`)
            return { error: e }
        }
    }

    static async updateStok(stokId, stokNum, date) {
        try {
            const updateResponse = await stok.updateOne(
                { _id: ObjectId(stokId) },
                { $set: { stok_num: stokNum, date: date }},
            )

            return updateResponse
        } catch(e) {
            console.error(`Unable to update stok: ${e}`)
            return { error: e }
        }
    }

    static async deleteStok(stokId) {
        try {
            const deleteResponse = await stok.deleteOne({
                _id: ObjectId(stokId),
            })

            return deleteResponse
        } catch(e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }
}