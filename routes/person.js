import express from 'express'
import createDebug from 'debug'
import Person from '../models/Person.js'
import sanitizeBody from '../middleware/sanitizeBody.js'
import authUser from '../middleware/authUser.js'
import ResourceNotFoundError from '../exceptions/ResourceNotFound.js'


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

router.get('/:id', async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id)
        if (!person) throw new ResourceNotFoundError('Resource not found')
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

router.put('/:id', sanitizeBody, update(true))
router.patch('/:id', sanitizeBody, update(false))



export default router;