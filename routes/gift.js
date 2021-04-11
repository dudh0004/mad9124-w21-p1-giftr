import express from 'express';
import authUser from '../middleware/authUser.js';
import sanitizeBody from '../middleware/sanitizeBody.js';
import User from '../models/User.js';
import Person from '../models/Person.js';
import Gift from '../models/Gift.js';
import ResourceNotFoundError from '../exceptions/ResourceNotFound.js';

const router = express.Router();

router.post('/:id/gifts', authUser, sanitizeBody, async (req, res, next) => {
  try {
    const newGift = new Gift(req.sanitizedBody);

    await newGift.save();
    await Person.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { gifts: newGift }
    });
    res.status(201).send({ data: newGift });
  } catch (error) {
    next(error);
  }
});

const updateGiftId = (toDelete = false) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let person = await Person.findById(req.params.id);
    
    if (String(user._id) !== String(person.owner)) {
      throw new Error('Sorry, you are not Authorized to change this gift.');
    }
    
    const hasGifts = person.gifts.filter(gift => String(gift) === String(req.params.giftId));

    if (!hasGifts.length) throw new Error(`Sorry, this person don't have this gift.`);

    const document = !toDelete
      ? await Gift.findByIdAndUpdate(
          req.params.giftId,
          req.sanitizedBody,
          {
            new: true,
            overwrite: false,
            runValidators: true
          }
        )
      : await Gift.findByIdAndRemove(req.params.giftId);

    if (!document) throw new ResourceNotFoundError('Resource not found');

    if (toDelete) {
      person.gifts = person.gifts.filter(gift => String(gift) !== String(req.params.giftId));
    }

    person.markModified('gifts');
    person.save();
    res.send({ data: document });
  } catch (error) {
    next(error);
  }
};

router.patch('/:id/gifts/:giftId', authUser, sanitizeBody, updateGiftId(false));
router.delete('/:id/gifts/:giftId', authUser, sanitizeBody, updateGiftId(true));

export default router;
