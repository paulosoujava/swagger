const NotImplementedException = require('./../../excpetions/notImplementedExcption')

class ICrud {
    create(item) {
        throw new NotImplementedException()
    }
    read(query, skip, limit) {
        throw new NotImplementedException()
    }
    update(id, item) {
        throw new NotImplementedException()
    }
    delete(id) {
        throw new NotImplementedException()
    }
    isConnected() {
        throw new NotImplementedException()
    }
    connect() {
        throw new NotImplementedException()
    }
}
module.exports = ICrud