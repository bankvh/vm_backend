import {Router} from 'express'
import { db, LOCATIONS, MACHINES, PRODUCTS } from '../config/db'

const router = Router()

export let subscribers = []

router.get('/', async (req, res, next) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache'
    }
    res.writeHead(200, headers)
    subscribers.push(res)
    const data = `data: ${JSON.stringify('connected')}\n\n`
    res.write(data)
})

router.post('/', async (req, res, next) => {
    const reqBody = req.body

    sendEventToAllSubscriber(reqBody)
    res.send('success')
})

export async function checkCurrentStock(machineId, stock) {
    const machine = await db.collection(MACHINES).findOne({id: Number(machineId)})
    const location = await db.collection(LOCATIONS).findOne({id: machine.location_id})

    for (const [key, value] of Object.entries(stock)) {
        if (value<10){
            const product = await db.collection(PRODUCTS).findOne({id: key})
            sendEventToAllSubscriber(`Location: ${location.name} -> ${product.name} stock is now at ${value}`)
        }
    }
}

export async function sendEventToAllSubscriber(event) {
    // ! Important: \n\n is so important for send data
    subscribers.forEach(s => s.write(`data: ${JSON.stringify(event)}\n\n`));
}


export default router