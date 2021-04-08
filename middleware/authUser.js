import config from 'config';
import jwt from 'jsonwebtoken';

const jwtConfig = config.get('jwt');
const parseToken = function (headerValue) {
  if (headerValue) {
    const [ type, token ] = headerValue.split(' ');

    if (type === 'Bearer' && typeof token !== 'undefined') {
      return token;
    }
  }

  return undefined;
};

export default function (req, res, next) {
  const headerValue = req.header('Authorization');
  const token = parseToken(headerValue);

  if (!token) {
    return res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Authentication failed',
          description: 'Missing Bearer token'
        }
      ]
    });
  }

  try {
    const payload = jwt.verify(token, `${jwtConfig.secretKey}`, { algorithms: ['HS256'] });

    req.user = { _id: payload.uid };
    next();
  } catch (err) {
    res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Authentication failed',
          description: 'Invalid Bearer token'
        }
      ]
    });
  }
};
