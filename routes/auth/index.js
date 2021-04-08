import express from 'express';
import User from '../../models/User.js';
import sanitizeBody from '../../middleware/sanitizeBody.js';
import authUser from '../../middleware/authUser.js';

const router = express.Router();

router.post('/users', sanitizeBody, async (req, res, next) => {
  new User(req.sanitizedBody)
    .save()
    .then(newUser => res.status(201).send({ data: newUser }))
    .catch(next);
});

router.get('/users/me', authUser, async (req, res) => {
  const user = await User.findById(req.user._id);

  res.send({ data: user });
});

router.patch('/users/me', authUser, sanitizeBody, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const password = await User.updatePassword(req.sanitizedBody.password);

    Object.assign(req.sanitizedBody, { password });

    const document = await User.findByIdAndUpdate(
      user._id,
      req.sanitizedBody,
      {
        new: true,
        overwrite: false,
        runValidators: true
      }
    );

    if (!document) throw new Error('Resource not found');

    res.send({ data: document });
  } catch (error) {
    sendResourceNotFound(req, res);
  }
});

router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody;
  const authenticatedUser = await User.authenticate(email, password);

  if (!authenticatedUser) {
    return res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Incorrect username or password'
        }
      ]
    });
  }

  res
    .status(201)
    .send({ data: { token: authenticatedUser.generateAuthToken() } });
});

function sendResourceNotFound(req, res) {
  res.status(404).send({
    error: [
      {
        status: '404',
        title: 'Resource does not exist',
        description: `We could not find a person with this id`,
      }
    ]
  })
}

export default router;
