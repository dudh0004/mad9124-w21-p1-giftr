import mongoose from 'mongoose'
import config from 'config'
import uniqueValidator from 'mongoose-unique-validator'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const jwtConfig = config.get('jwt')
const schema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true, maxlenght: 64 },
    lastName: { type: String, trim: true, required: true, maxlenght: 64 },
    email: {
      type: String,
      trim: true,
      required: true,
      maxlenght: 512,
      set: (value) => value.toLowerCase(),
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },
    password: { type: String, trim: true, required: true, maxlenght: 70 },
  },
  {
    timestamps: true,
  }
)

schema.methods.generateAuthToken = function () {
  const payload = { uid: this._id }

  return jwt.sign(payload, `${jwtConfig.secretKey}`, {
    expiresIn: '1h',
    algorithm: 'HS256',
  })
}

schema.methods.toJSON = function () {
  const obj = this.toObject()

  delete obj.password
  delete obj.__v
  return obj
}

schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email })
  const badHash = `$2b$${jwtConfig.saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
  const hashedPassword = user ? user.password : badHash
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword)

  return passwordDidMatch ? user : null
}

schema.statics.updatePassword = async function (password) {
  const newPassword = await bcrypt.hash(password, jwtConfig.saltRounds)

  return newPassword
}

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, jwtConfig.saltRounds)
  next()
})

schema.plugin(uniqueValidator, {
  message: function (props) {
    if (props.path === 'email') {
      return `The email address ${props.value} is already registered.`
    }

    return `The ${props.path} most be unique. ${props.value} is already in use.`
  },
})

const Model = mongoose.model('User', schema)

export default Model
