import mongoose from 'mongoose'

const url = process.env.MONGODB_URI

if (!url) {
  throw new Error('MONGODB_URI environment variable is not defined')
}

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 }).then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

export default mongoose.model('Person', personSchema)

// if (process.argv.length === 3) {
//   Person.find({}).then( result => 
//     result.forEach(person => console.log(person))
//   )
//   mongoose.connection.close()
// } else {
//   console.log('more args')
// }