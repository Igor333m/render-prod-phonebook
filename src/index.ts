import express from 'express'
import type { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import requestLogger from './middlewares/requestLogger.js'
import unknownEndpoint from './middlewares/unknownEndpoint.js'
import morgan from 'morgan'
import type { Person } from './types/person'


const app = express()
app.use(express.json())

app.use(requestLogger)

// create a write stream (in append mode)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Really bad practice to log the body, security issue!
morgan.token('body', function (req: Request<{}, any>, res: Response) { return JSON.stringify(req.body) })
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :body', { stream: accessLogStream }))


let persons: Person[] = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons/', (request, response) => {
  response.json(persons)
})

let getCurrentPersonsLength = persons.length

const info = `<p>Phonebook has info for ${getCurrentPersonsLength} people</p>\n${new Date()}`

app.get('/api/info', (request, response) => {
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if(person) response.json(person)
  else {
    response.statusMessage = 'Not found!'
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  if(getCurrentPersonsLength === persons.length) response.statusMessage = 'Something went wrong!'
  else {
    getCurrentPersonsLength = persons.length
    response.statusMessage = 'Note successufully deleted!'
  }

  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const id = String(Math.ceil(Math.random() * 9e15))

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Content missing' 
    })
  }

  const filter = persons.find(person => person.name === body.name)

  if (filter) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }

  const newPerson: Person = {
    id,
    name: body.name,
    number: body.number || 'unknown'
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)