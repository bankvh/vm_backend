import {Router} from 'express'
import {db,LOCATIONS, MACHINES, PRODUCTS} from '../config/db'

const router = Router()

router.get('/', async (req, res, next) => {
    const locations = await db.collection(LOCATIONS).find({}).toArray()
    res.send(locations)
})

router.get('/:locationId/machine', async (req, res, next) => {
    const locationId = Number(req.params.locationId)

    if (Number.isNaN(locationId)){
        return res.status(400).send(`Location Id is incorrect`)
    }

    const pipeline = [
        {$match: {location_id: locationId}},
        {$project: {_id: 0, id: 1,quantitys: {$objectToArray: "$products"}}},
        {$lookup: {
            from: PRODUCTS,
            localField: 'quantitys.k',
            foreignField: 'id',
            as: 'products'
        }},
        {$project: {
            id: 1,
            products: {
                $map: {
                    input: "$quantitys",
                    as: "quantitys",
                    in: {
                        $mergeObjects: [
                            "$$quantitys",
                            {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$products",
                                            as: "products",
                                            cond: { $eq: ["$$quantitys.k", "$$products.id"]}
                                        }
                                    },
                                    0
                                ]
                            }
                        ]
                    }
                }
            }
        }}
    ]

    const result = await db.collection(MACHINES).aggregate(pipeline).toArray()

    if(!result[0]){
        return res.status(404).send(`Machine at Location ${locationId} not found`)
    }

    res.send(result[0])
})

export default router