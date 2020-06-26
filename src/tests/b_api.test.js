const assert = require('assert')
const api = require('./../../server')
let app = {}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGEiLCJpZCI6MSwiaWF0IjoxNTkzMTg5MDA3fQ.Q5nIKJg0ECMGbaSUjkWNsJDlgy53l8bKw6-j1qcoM9M'
const headers = {
    authorization: TOKEN
}


describe('SUITE DE TESTES NA API  HEROS', function() {
    this.beforeAll(async() => {
        app = await api
    })

    it('Listar todos os herois [endpoint:: /users ] espera retorno HTTP 200 OK  e um array', async() => {
        const result = await app.inject({
            method: 'GET',
            url: '/users',
            headers
        })
        const dados = JSON.parse(result.payload)
        assert.ok(Array.isArray(dados))
        assert.deepEqual(result.statusCode, 200)
    })

    it('Lista somente 5 registros [endpoint:: /user?skip=0&limit=5] espera 5 registros HTTP 200 OK ', async() => {
        const SIZE = 5
        const result = await app.inject({
            method: 'GET',
            url: `/users?skip=0&limit=${SIZE}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        assert.deepEqual(result.statusCode, 200)
        assert.ok(dados.length === SIZE)
    })

    it('Validar se o ID é válido [endpoint:: /user?skip=0&limit=SIZE] espera um HTTP 400 - Solicitação incorreta ', async() => {
        const SIZE = 'NAO_EH_VALIDO'
        const result = await app.inject({
            method: 'GET',
            url: `/users?skip=0&limit=${SIZE}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        assert.ok(result.statusCode, 400)
        assert.deepEqual(dados.error, 'Bad Request')
    })

    it('Filtar um item [endpoint:: /user?skip=0&limit=5&nome=FILTRO] espera um Array HTTP 200 OK ', async() => {
        const SIZE = 3
        const FILTRO = 'Chapolin Colorado'
        const result = await app.inject({
            method: 'GET',
            url: `/users?skip=0&limit=${SIZE}&nome=${FILTRO}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        assert.ok(Array.isArray(dados))
        assert.deepEqual(result.statusCode, 200)
    })

    MOCK_CREATE = {
        nome: 'Papa Goach',
        poder: 'Mimimi'
    }
    MOCK_ID = ''
    it('Cadastrar  [endpoint:: /users] espera um code:: HTTP 200 OK, mesage:: Ação realizada com sucesso! e ID != de vazio ', async() => {
        const result = await app.inject({
            method: 'POST',
            url: `/users`,
            headers,
            payload: JSON.stringify(MOCK_CREATE)
        })
        assert.ok(result.statusCode, 200)
        const dados = JSON.parse(result.payload)

        assert.deepEqual(dados.message, 'Ação realizada com sucesso!')
        assert.ok(dados._id, '')
            //to updaate
        MOCK_ID = dados._id
    })
    MOCK_UPDATE = {
        nome: 'Pepa Pig',
        poder: 'Chatear os Pais'
    }
    it('Atualizar [endpoint:: /users/:id] espera um code:: HTTP 200 OK, message:: Ação realizada com sucesso!', async() => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/users/${MOCK_ID}`,
            headers,
            payload: JSON.stringify(MOCK_UPDATE)
        })
        assert.ok(result.statusCode, 200)
        const dados = JSON.parse(result.payload)
        assert.deepEqual(dados.message, 'Ação realizada com sucesso!')

    })
    it('Atualizar ID INVALIDO [endpoint:: /users/:id] espera  Code:: HTTP 412 error:: Precondition Failed message: Id não encontrado', async() => {
        MOCK_ID_ERROR = '5af413fd20e3025da49c1b34'
        const result = await app.inject({
            method: 'PATCH',
            url: `/users/${MOCK_ID_ERROR}`,
            headers,
            payload: JSON.stringify(MOCK_UPDATE)
        })
        const dados = JSON.parse(result.payload)
        assert.ok(dados.statusCode, 412)
        assert.deepEqual(dados.error, 'Precondition Failed')
        assert.deepEqual(dados.message, 'Id não encontrado')

    })

    it('Deletear pelo ID [endpoint:: /users/:id] espara code:: HTTP 200 OK, message:: Ação realizada com sucesso!', async() => {
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/users/${MOCK_ID}`
        })
        assert.ok(result.statusCode, 200)
        const dados = JSON.parse(result.payload)
        assert.deepEqual(dados.message, 'Ação realizada com sucesso!')
    })

    it('Deletear pelo ID INEXISTENTE [endpoint:: /users/:id] espara Code:: HTTP 412 error:: Precondition Failed message: Id não encontrado', async() => {
        const MOCK_ID_DELETE = '5ef3d55a2e5bd650c7fbad22'
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/users/${MOCK_ID_DELETE}`
        })
        const dados = JSON.parse(result.payload)

        assert.ok(dados.statusCode, 412)
        assert.deepEqual(dados.error, 'Precondition Failed')
        assert.deepEqual(dados.message, 'Id não encontrado')
    })
    it('Deletear sem enviar o id [endpoint:: /users/:id] espara code:: HTTP 404 error:: Not Found mensage:: Not Found', async() => {
        const MOCK_NO_ID_DELETE = ''
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/users/${MOCK_NO_ID_DELETE}`
        })
        const dados = JSON.parse(result.payload)
        assert.ok(dados.statusCode, 404)
        assert.deepEqual(dados.message, 'Not Found')
    })



})