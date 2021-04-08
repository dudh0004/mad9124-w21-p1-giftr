import express from 'express'
import createDebug from 'debug'
import Person from '../models/Person.js'
import sanitizeBody from '../middleware/sanitizeBody.js'
import authUser from '../middleware/authUser.js'

const debug = createDebug('giftr:routes:people')
const router = express.Router()

router.get('/', async (req, res) => {
    const collection = await Person.find()
    res.send({ data: collection })
})

export default router;