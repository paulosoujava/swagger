const Mongoose = require('mongoose')

const heroisSchema = new Mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    poder: {
        type: String,
        require: true
    },
    insertAt: {
        type: Date,
        require: new Date()
    }
})

module.exports = Mongoose.model('herois', heroisSchema)