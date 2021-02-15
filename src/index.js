import express from 'express'
import cors from 'cors'

import {connectDb} from './config/db' 

import event from './routes/event'
import location from './routes/location'
import machine from './routes/machine'

const PORT = 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/event', event)
app.use('/location', location)
app.use('/machine', machine)

connectDb(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}!`)
    })
})