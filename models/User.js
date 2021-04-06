import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'

const schema = new mongoose.Schema({  
  firstName: { type: String, trim: true, required: true, maxlenght: 64 },
  lastName: { type: String, trim: true, required: true, maxlenght: 64 },
  email: {
    type: String,
    trim: true,
    required: true,
    maxlenght: 512,
    set: value => value.toLowerCase(),
    unique: true,
    validate: {
      validator: value => validator.isEmail(value),
      message: props => `${props.value} is not a valid email address.`
    }
  },
  password: { type: String, trim: true, required: true, maxlenght: 70 }
}, {
  timestamps: true
});

schema.plugin(uniqueValidator, {
  message: function(props) {
    if (props.path === 'email') {
      return `The email address ${props.value} is already registered.`;
    }

    return `The ${props.path} most be unique. ${props.value} is already in use.`;
  }
});

const Model = mongoose.model('User', schema);

export default Model;
