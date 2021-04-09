import mongoose from 'mongoose';

const Gift = new mongoose.Schema({ type: String });

const schema = new mongoose.Schema({
    name: { type: String, trim: true, maxlength: 254, required: true },
    birthDate: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, default: 'Current user', ref: 'User' },
    sharedWith: [ { type: mongoose.Schema.Types.ObjectId , ref: 'User' } ],
    gifts:   [ Gift ],
    imageUrl: { type: String, trim: true, maxlength: 1024 },
},
    {
        timestamp: { type: Date, default: Date.now},
    }
)
    const Model = mongoose.model('Person', schema)

    export default Model