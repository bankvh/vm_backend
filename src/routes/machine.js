import {Router} from 'express'
import { db, MACHINES } from '../config/db'
import { checkCurrentStock, sendEventToAllSubscriber } from './event'

const router = Router()

router.post('/:machineId/checkout', async (req, res, next) => {

    const machineId = req.params.machineId
    const reqBody = req.body
    const machine = await db.collection(MACHINES).findOne({id: Number(machineId)})

    if (!machine){
        return res.status(404).send(`Machine Id: ${machineId} not found`)
    }

    const stock = machine.products
    const notifyStock = {}

    for (const [key, value] of Object.entries(reqBody)) {
        const newStock = stock[key]-value
        if (newStock < 0){
            return res.status(400).send(`Out of stock`)
        } else if (Number.isNaN(newStock)) {
            return res.status(400).send(`Product ID: ${key} is not in machine`)
        } else {
            stock[key] = newStock
            notifyStock[key] = newStock
        }
    }
    
    const updatedMachine = await db.collection(MACHINES).updateOne({id: Number(machineId)},{$set: {products: stock}})

    if (updatedMachine.result.nModified === 1){
        checkCurrentStock(machineId, notifyStock)
        return res.send('success')
    } else {
        return res.status(400).send('Order fail')
    }

})

export default router