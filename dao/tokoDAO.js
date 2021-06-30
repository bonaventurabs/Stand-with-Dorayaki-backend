import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let toko

export default class TokoDAO {
    static async injectDB(conn) {
        if (toko) {
            return
        }
        try {
            toko = await conn.db(process.env.STOKDORAYAKI_NS).collection("toko")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in tokoDAO: ${e}`,
            )
        }
    }

    static async getToko({
        filters = null, 
        page = 0,
        tokoPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("nama" in filters) {
                query = { $text: { $search: filters["nama"]}}
            } else if ("jalan" in filters) {
                query = { "jalan": { $eq: filters["jalan"]}}
            } else if ("kecamatan" in filters) {
                query = { "kecamatan": { $eq: filters["kecamatan"]}}
            } else if ("provinsi" in filters) {
                query = { "provinsi": { $eq: filters["provinsi"]}}
            }
        }

        let cursor
        try {
            cursor = await toko
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { tokoList: [], totalNumToko: 0 }
        }

        const displayCursor = cursor.limit(tokoPerPage).skip(tokoPerPage = page)

        try {
            const tokoList = await displayCursor.toArray()
            const totalNumToko = await toko.countDocuments(query)
            
            return { tokoList, totalNumToko }
        } catch (e) {
            console.error(
                `Unable to conver cursor to array or problem counting document, ${e}`
            )
            return { tokoList: [], totalNumToko: 0 }
        }
    }

    static async getTokoById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "stok",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$toko_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "stok",
                    },
                },
                {
                    $addFields: {
                        stok: "$stok",
                    },
                },
            ]
            return await toko.aggregate(pipeline).next()
        } catch (e) {
            console.error(`Something whent wrong in getTokoById: ${e}`)
            throw e
        }
    }

    static async updateToko(tokoId, nama, jalan, kecamatan, provinsi, date) {
        try {
            const updateResponse = await toko.updateOne(
                { _id: ObjectId(tokoId) },
                { $set: { 
                    nama: nama, 
                    jalan: jalan,
                    kecamatan: kecamatan,
                    provinsi: provinsi,
                    date: date,
                }},
            )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update toko: ${e}`)
            return { error: e }
        }
    }

    static async deleteToko(tokoId) {
        try {
            const deleteResponse = await toko.deleteOne({
                _id: ObjectId(tokoId),
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete toko: ${e}`)
            return { error: e }
        }
    } 

    static async addToko(nama, jalan, kecamatan, provinsi, date) {
        try {
            const tokoDoc = {
                nama: nama, 
                jalan: jalan,
                kecamatan: kecamatan,
                provinsi: provinsi,
                date: date,
            }

            return await toko.insertOne(tokoDoc)
        } catch (e) {
            console.error(`Unable to post toko: ${e}`)
            return { error: e }
        }
    }
}