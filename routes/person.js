import express from 'express'
import createDebug from 'debug'
import Person from '../models/Person.js'
import sanitizeBody from '../middleware/sanitizeBody.js'
import authUser from '../middleware/authUser.js'
import User from '../models/User.js'
import ResourceNotFoundError from '../exceptions/ResourceNotFound.js'

const debug = createDebug('giftr:routes:people')
const router = express.Router()

router.get('/', authUser, async (req, res, next) => {
  try {
    const people = await Person.find()
    const result = people.filter(
      (person) => String(person.owner) === String(req.user._id)
    )

    res.send({ data: result })
  } catch (error) {
    next(error)
  }
})

router.post('/', authUser, sanitizeBody, async (req, res) => {
  try {
    let newPerson = new Person(req.sanitizedBody)

    await newPerson.save()
    res.status(201).send({ data: newPerson })
  } catch (err) {
    debug(err)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving document to the database.',
        },
      ],
    })
  }
})

router.get('/:id', authUser, async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id).populate('owner')

    if (!person) {
      throw new ResourceNotFoundError('Resource not found')
    }

    res.send({ data: person })
  } catch (err) {
    next(err)
  }
})

const update = (overwrite = false) => async (req, res, next) => {
  try {
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      req.sanitizedBody,
      {
        new: true,
        overwrite,
        runValidators: true,
      }
    )

    if (!person) throw new ResourceNotFoundError('Resource not found')

    res.send({ data: person })
  } catch (err) {
    next(err)
  }
}

router.put('/:id', sanitizeBody, authUser, update(true))
router.patch('/:id', sanitizeBody, authUser, update(false))

router.delete('/:id', authUser, async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    const user = await User.findById(req.user._id)

    if (!user) {
      throw new ResourceNotFoundError('You are not Authorized.')
    }

    await Person.findByIdAndRemove(req.params.id)
    res.send({ data: person })
  } catch (err) {
    next(err)
  }
})

export default router
