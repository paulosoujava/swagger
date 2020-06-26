const ICrud = require('./../interfaces/interfaceCrud')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'Discontadado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Discontadando',
}

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._schema = schema
        this._connection = connection
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if (state === 'Conectado')
            return state
        if (state !== 'Conectando')
            return state
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]
    }

    static connect() {
        Mongoose.connect('mongodb://paulo:minhaoutrasenhasecreta@localhost:27017/herois', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (!err) return
                //console.log('Falha na conexão', err);
        })
        return Mongoose.connection
    }

    async create(item) {
        return this._schema.create(item)
    }
    async read(query, skip = 0, limit = 10) {
        return this._schema.find(query).skip(skip).limit(limit)
    }
    async update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item })
    }
    async delete(id) {
        return this._schema.deleteOne({ _id: id })
    }
}
module.exports = MongoDB