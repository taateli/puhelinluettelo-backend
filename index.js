const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


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

  res.send('<div>puhelinluettelossa on ' + docs + ' henkilön tiedot</div><div> ' + today + '</div>')
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      console.log(persons)
      response.json(persons.map(formatPerson))
    })
    .catch(error => {
      console.log(error)
    
})
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
       if (person) {
        response.json(formatPerson(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  
  Person
	  .findByIdAndRemove({_id: request.params.id}, 
	   function(err, docs){
		if(err) response.json(err)
		else    response.status(204).end()
	})
    .catch(error => {
    console.log(error)
})
  
  
})



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

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(formatPerson(savedPerson))
    })
    .catch(error => {
      console.log(error)
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const formatPerson = (person) => {
  const formattedPerson = { ...person._doc, id: person._id }
  delete formattedPerson._id
  delete formattedPerson.__v

  return formattedPerson
}



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})