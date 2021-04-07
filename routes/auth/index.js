import express from 'express';
import User from '../../models/User.js';
import authUser from '../../middleware/authUser.js';

const router = express.Router();

router.post('/users', async (req, res, next) => {
  new User(req.body)
    .save()
    .then(newUser => res.status(201).send({ data: newUser }))
    .catch(next);
});

router.get('/users/me', authUser, async (req, res) => {
  const user = await User.findById(req.user._id);

  res.send({ data: user });
});

const update = (overwrite = false) => async (req, res) => {
  console.log(req.body);

  try {
    req.body.password = await User.updatePassword(req.body.password);

    const document = await User.findByIdAndUpdate(

      // FIXME: find id
      // req.params.id,
      '606d08468f52043524970248',

      req.body,
      {
        new: true,
        overwrite,
        runValidators: true
      }
    );

    if (!document) throw new Error('Resource not found');

    res.send({ data: document });
  } catch (error) {
    sendResourceNotFound(req, res);
  }
};

router.patch('/users/me', update(false));

router.post('/tokens', async (req, res) => {
  const { email, password } = req.body;
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
        description: `We could not find a person with id: ${req.params.id}`,
      }
    ]
  })
}

export default router;
