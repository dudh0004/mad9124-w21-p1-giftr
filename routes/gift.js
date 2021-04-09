import express from 'express'
import sanitizeBody from '../middleware/sanitizeBody.js';

const router = express.Router();

router.post('/:id/gifts', sanitizeBody, async (req, res, next) => {

})

// router.patch()

// router.delete()

export default router