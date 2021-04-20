import config from 'config'
import jwt from 'jsonwebtoken'

const jwtConfig = config.get('jwt')
const apiKey = config.get('apiKey')
const parseToken = function (headerValue) {
  if (headerValue) {
    const [type, token] = headerValue.split(' ')

    if (type === 'Bearer' && typeof token !== 'undefined') {
      return token
    }
  }

  return undefined
}

export default function (req, res, next) {
  const headerValue = req.header('Authorization')
  const headerApiKey = req.header('x-api-key')
  const token = parseToken(headerValue)

  if (!token || (headerApiKey !== apiKey)) {
    let errorMessage = !token ? 'Bearer token' : 'API Key';

    return res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Authentication failed',
          description: `Missing ${errorMessage}`,
        },
      ],
    })
  }

  try {
    const payload = jwt.verify(token, `${jwtConfig.secretKey}`, {
      algorithms: ['HS256'],
    })

    req.user = { _id: payload.uid }
    next()
  } catch (err) {
    res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Authentication failed',
          description: 'Invalid Bearer token',
        },
      ],
    })
  }
}
