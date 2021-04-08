import express from 'express'
import createDebug from 'debug'
import Person from '../models/Person.js'
import sanitizeBody from '../middleware/sanitizeBody.js'
import authUser from '../middleware/authUser.js'

const debug = createDebug('giftr:routes:people')
const router = express.Router()

router.get('/', async (req, res) => {
    const person = await Person.find()
    res.send({ data: person })
})

router.post('/', sanitizeBody, async (req, res) => {
    let newPerson = new Person(req.sanitizedBody)
    try {
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

export default router;