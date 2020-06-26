const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')


MOCK_PASSWORD = '1234'
MOCK_HASH = '$2b$04$6BggaFHUf0LnmxiyrA1lbukJ3y0JgAK0yY0UAyXKHLL07iUIM6Y2u'


describe('Password Tests Suite', function() {

    it('deve gerar um hash a partir de uma senha, Espera um hash > 10', async() => {
        const result = await PasswordHelper.hashPassword(MOCK_PASSWORD)
            //console.log(result);
        assert.ok(result.length > 10)
    })
    it('deve validar a senha e seu hash. Espera um TRUE validando a senha com o hash', async() => {
        const result = await PasswordHelper.comparePassword(MOCK_PASSWORD, MOCK_HASH)
        assert.ok(result)
    })

})