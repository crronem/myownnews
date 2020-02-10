// const logger = require('debug-level')('anycoop')
const Mongoose = require('mongoose')
// const config = require('../common/config')

Mongoose.plugin(schema => {
    schema.pre('findOneAndUpdate', setDefaultOptions);
    schema.pre('updateMany', setDefaultOptions);
    schema.pre('updateOne', setDefaultOptions);
    schema.pre('update', setDefaultOptions);
})

function setDefaultOptions() {
    this.setOptions({ runValidators: true, new: true });
}

const UserSchema = new Mongoose.Schema({
    ONEmUserId: { type: String },
    name: { type: String, default: null },
    mobile: { type: String, default: null },
    email: { type: String, default: null },
    username: { type: String, default: null },
    password: { type: String, default: null },
    validated: { type: Boolean, default: false }
}, {
    timestamps: true
})
const Users = Mongoose.model('users', UserSchema)

const EnquiriesSchema = new Mongoose.Schema({
    _user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    interest: { type: String },
    message: { type: Object }
}, {
    timestamps: true
})
const Enquiries = Mongoose.model('enquiries', EnquiriesSchema)

const MessagesSchema = new Mongoose.Schema({
    _sell: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'sells',
        required: false
    },
    _buy: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'buys',
        required: false
    },
    message: { type: String },
    subject: { type: String }
}, {
    timestamps: true
})
const Messages = Mongoose.model('messages', MessagesSchema)

const AdminsSchema = new Mongoose.Schema({
    _user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    name: { type: String},
    password: { type: String},
    admin: {type: String},
    access: {type: Object}
}, {
    timestamps: true
})
const Admins = Mongoose.model('admins', AdminsSchema)

module.exports = {
    Users,
    Enquiries,
    Messages,
    Admins
}


