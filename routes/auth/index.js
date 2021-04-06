import User from '../../models/User.js'
import express from 'express';

const router = express.Router();

router.post('/tokens', async (req, res) => {
  const { email, password } = req.body;
  const authenticatedUser = await User.authenticate(email, password);

  if (!authenticatedUser) {
    return res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Incorrect username or password',
        }
      ]
    });
  }

  res
    .status(201)
    .send({ data: { token: authenticatedUser.generateAuthToken() } });
});

export default router;
