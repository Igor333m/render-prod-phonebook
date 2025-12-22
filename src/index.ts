import express from 'express'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import 'dotenv/config'
import { fileURLToPath } from 'url'
import requestLogger from './middlewares/requestLogger.js'
import unknownEndpoint from './middlewares/unknownEndpoint.js'
import morgan from 'morgan'
// import type { Person } from './types/person'

import Person from './models/Person.js'


const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)

// create a write stream (in append mode)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: accessLogStream }))

app.get('/api/persons/', (request, response) => {
  Person.findById({}).then(persons => response.json(persons))
})

// let getCurrentPersonsLength = persons.length

// const info = `<p>Phonebook has info for ${getCurrentPersonsLength} people</p>\n${new Date()}`

// app.get('/api/info', (request, response) => {
//   response.send(info)
// })

// app.get('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   const person = persons.find(person => person.id === id)

//   if(person) response.json(person)
//   else {
//     response.statusMessage = 'Not found!'
//     response.status(404).end()
//   }
// })

// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   persons = persons.filter(person => person.id !== id)

//   if(getCurrentPersonsLength === persons.length) response.statusMessage = 'Something went wrong!'
//   else {
//     getCurrentPersonsLength = persons.length
//     response.statusMessage = 'Note successufully deleted!'
//   }

//   response.status(204).end()
// })

// app.post('/api/persons/', (request, response) => {
//   const id = String(Math.ceil(Math.random() * 9e15))

//   const body = request.body

//   if (!body.name || !body.number) {
//     return response.status(400).json({ 
//       error: 'Content missing' 
//     })
//   }

//   const filter = persons.find(person => person.name === body.name)

//   if (filter) {
//     return response.status(400).json({ 
//       error: 'Name must be unique' 
//     })
//   }

//   const newPerson: Person = {
//     id,
//     name: body.name,
//     number: body.number || 'unknown'
//   }

//   persons = persons.concat(newPerson)
//   response.json(newPerson)
// })

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)