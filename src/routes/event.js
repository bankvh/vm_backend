import {Router} from 'express'

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

    sendEventToAllSubscriber('yay')
    res.send('success')
})

export async function sendEventToAllSubscriber(event) {
    // ! Important: \n\n is so important for send data
    subscribers.forEach(s => s.write(`data: ${JSON.stringify(event)}\n\n`));
}


export default router