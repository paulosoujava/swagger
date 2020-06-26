const assert = require('assert')
const api = require('../../server')
const MongoDB = require('./../db/mongo/mongo')
const Context = require('./../db/base/context')
const Schema = require('./../db/mongo/schemas/authSchema')



let app = {}
const USER = {
        username: 'paulo',
        password: '1234'
    }
    //DESCOMENTE PARA CRIAR UM USUARIO E DESCOMENTE TBM O TESTE  Cadastrar um usuário
    // const USER_DB = {
    //     username: 'paulo',
    //     password: '$2b$04$6BggaFHUf0LnmxiyrA1lbukJ3y0JgAK0yY0UAyXKHLL07iUIM6Y2u'
    // }


describe('Suite de testes para o Auth ', function() {

    this.beforeAll(async() => {
            app = await api
                //const connection = MongoDB.connect()
                //context = new Context(new MongoDB(connection, Schema))
        })
        //PARA CADASTRAR UM AUTH E TESTAR DESCOMENTE ABAIXO EXECUTE E DEPOIS COMENTE NOVAMENTE PARA NAO DUPLICAR
        // it(' Cadastrar um usuário', async() => {
        //     const { username, password } = await context.create(USER_DB)
        //     assert.deepEqual({ username, password }, USER_DB)
        // })

    it('deve obter um token endpoint [/login] espera code:: HTTP 200, TOKEN > 10', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER

        })
        const dados = JSON.parse(result.payload)

        assert.deepEqual(result.statusCode, 200)
        assert.ok(dados.token.length > 10)
    })
    it('deve obter um erro endpoint [/login] espera code:: HTTP 400, error: Bad Request,', async() => {
        USER_ERROR = {
            username: 'pagadinha do malandro',
            password: '666'
        }
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER_ERROR

        })
        const dados = JSON.parse(result.payload)
        assert.deepEqual(dados.statusCode, 400)
        assert.ok(dados.error === 'Bad Request')
    })
})