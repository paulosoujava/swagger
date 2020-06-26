const Mongoose = require('mongoose')

const authSchema = new Mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    insertAt: {
        type: Date,
        require: new Date()
    }
})

module.exports = Mongoose.model('auth', authSchema)