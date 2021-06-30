import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let dorayaki

export default class dorayakiDAO {
    static async injectDB(conn) {
        if (dorayaki) {
            return
        }
        try {
            dorayaki = await conn.db(process.env.STOKDORAYAKI_NS).collection("dorayaki")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in dorayakiDAO: ${e}`,
            )
        }
    }

    static async getDorayaki({
        filters = null, 
        page = 0,
        dorayakiPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("rasa" in filters) {
                query = { $text: { $search: filters["rasa"]}}
            }
        }

        let cursor
        try {
            cursor = await dorayaki
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { dorayakiList: [], totalNumDorayaki: 0 }
        }

        const displayCursor = cursor.limit(dorayakiPerPage).skip(dorayakiPerPage = page)

        try {
            const dorayakiList = await displayCursor.toArray()
            const totalNumDorayaki = await dorayaki.countDocuments(query)
            
            return { dorayakiList, totalNumDorayaki }
        } catch (e) {
            console.error(
                `Unable to conver cursor to array or problem counting document, ${e}`
            )
            return { dorayakiList: [], totalNumDorayaki: 0 }
        }
    }

    static async getDorayakiById(id) {
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
                                        $eq: ["$dorayaki_id", "$$id"],
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
            return await dorayaki.aggregate(pipeline).next()
        } catch (e) {
            console.error(`Something whent wrong in getDorayakiById: ${e}`)
            throw e
        }
    }

    static async updateDorayaki(dorayakiId, rasa, deskripsi, date) {
        try {
            const updateResponse = await dorayaki.updateOne(
                { _id: ObjectId(dorayakiId) },
                { $set: { 
                    rasa: rasa,
                    deskripsi: deskripsi,
                    date: date,
                }},
            )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update dorayaki: ${e}`)
            return { error: e }
        }
    }

    static async deleteDorayaki(dorayakiId) {
        try {
            const deleteResponse = await dorayaki.deleteOne({
                _id: ObjectId(dorayakiId),
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete dorayaki: ${e}`)
            return { error: e }
        }
    } 

    static async addDorayaki(rasa, deskripsi, date) {
        try {
            const dorayakiDoc = {
                rasa: rasa,
                deskripsi: deskripsi,
                date: date,
            }

            return await dorayaki.insertOne(dorayakiDoc)
        } catch (e) {
            console.error(`Unable to post dorayaki: ${e}`)
            return { error: e }
        }
    }
}