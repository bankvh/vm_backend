
import {MongoClient} from 'mongodb'

const DATABASE_URL='mongodb://localhost:27017'
const DATABASE_NAME='vending_machine'

let db
// collection name
 export const
      LOCATIONS = 'locations', 
      MACHINES = 'machines',
      PRODUCTS = 'products'

const connectDb = async (callback) => {
  try {
    const client = await MongoClient.connect(DATABASE_URL, {useUnifiedTopology: true})
    db = client.db(DATABASE_NAME)
    callback()
  } catch (err) {
    console.log(err)
    console.log(`ERROR: CANNOT CONNECT TO ${DATABASE_URL}/${DATABASE_NAME}`)
  } 
}

const closeConnection = () =>{
  db.close()
}

export {
  db
}

export {
  connectDb,
  closeConnection
}