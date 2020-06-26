const assert = require('assert')
const MongoDB = require('./../db/mongo/mongo')
const Context = require('./../db/base/context')
const HeroSchema = require('./../db/mongo/schemas/heroSchema')

//test na table auth
const USER = {
    username: 'paulo',
    password: '1234'
}

const MOCK_USER = {
    nome: 'Chapolin Colorado',
    poder: 'marreta bionica'
}
const MOCK_USER_UPDATE = {
    nome: 'Capitão Caverna',
    email: 'porrete'
}
let MOCK_USER_ID_UPDATE = ''
let MOCK_USER_ID_DELETE = ''
let context = {}

describe('SUITE DE TESTES MONGODB', function() {
    this.beforeAll(async() => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroSchema))
            //to  update
        const result = await context.create(MOCK_USER_UPDATE)
        MOCK_USER_ID_UPDATE = result._id
            //to  delete
        const res = await context.create(MOCK_USER)
        MOCK_USER_ID_DELETE = res._id

    })
    it('FASE 1 Verificar a Conexao', async() => {
        const result = await context.isConnected()
        assert.deepEqual(result, 'Conectado')
    })
    it('FASE 2 Cadastrar um usuário', async() => {
        const { nome, poder } = await context.create(MOCK_USER)
        assert.deepEqual({ nome, poder }, MOCK_USER)
    })
    it('FASE 3 listar usuários', async() => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_USER.nome })
        const result = { nome, poder }
        assert.deepEqual(result, MOCK_USER)
    })
    it('FASE 4 deletar um id', async() => {
        const result = await context.delete(MOCK_USER_ID_DELETE)
        assert.deepEqual(result.n, 1)
    })
    it('FASE 5 atualizar um id', async() => {
        const result = await context.update(MOCK_USER_ID_UPDATE, {
            nome: 'Galinha Pintadinha',
            poder: 'encher o saco'
        })
        assert.deepEqual(result.nModified, 1)
    })
    it('FASE 6 listar todos da tabela auth, ', async() => {
        const result = await context.read()
        assert.ok(result.username !== '')
    })
    it('FASE 7 listar UM usuário da tabela auth', async() => {
        const result = await context.read({ username: USER.username.toLowerCase() })
        assert.ok(result.username !== '')
    })
})