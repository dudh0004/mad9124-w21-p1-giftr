import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: { type: String, trim: true, maxlength: 254, required: true },
    birthDate: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, default: 'Current user', ref: 'User' },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId , ref: 'User' }],
    gifts: [{ type: mongoose.Schema.Types.ObjectId , ref: 'Gift' }],
    imageUrl: { type: String, trim: true, maxlength: 1024 }
}, {
    timestamps: { type: Date, default: Date.now() }
});

schema.methods.toJSON = function () {
    const obj = this.toObject();

    delete obj.owner.password;
    delete obj.__v;
    return obj;
};

const Model = mongoose.model('Person', schema);

export default Model;
