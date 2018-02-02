const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')


morgan.token('params', function getParams (req) {
  return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :params :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())

let persons = [
    {
      "name": "Tatu Helander",
      "number": "2222",
      "id": 6
    },
    {
      "name": "Arto Hellas",
      "number": "040 551245513",
      "id": 7
    },
    {
      "name": "Arto Helmani",
      "number": "0405121321",
      "id": 8
    },
    {
      "name": "Aapeli",
      "number": "123145",
      "id": 9
    }
]

app.get('/info', (req, res) => {
  const today = Date()
  res.send('<div>puhelinluettelossa on ' + persons.length + ' henkilön tiedot</div><div> ' + today + '</div>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)

  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = Math.floor(Math.random() * Math.floor(100000000))
  return maxId
}

app.post('/api/persons', (request, response) => {
  
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }

  if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  }

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const person = {
    content: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})