const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi')
const Boom = require('boom')

const _message = 'Ação realizada com sucesso!'

const failAction = (request, headers, error) => {
    return error
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }


    list() {
        return {
            path: '/users',
            method: 'GET',
            options: {
                tags: ['api'],
                description: 'Lista todos os herois com filtro pela url, nome, skip e limit',
                notes: 'Este endponit pode filtrar por nome, limitar [limit] ou saltar [skip]',
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            500: { 'description': 'Internal error' },
                            400: { 'description': 'BadRequest' },
                            200: { 'description': 'Ok' }
                        }
                    }
                },
                validate: {
                    failAction,
                    headers,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100),
                    })
                },

            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    let query = {
                        nome: {
                            $regex: `.*${nome}*.`
                        }
                    }
                    return this.db.read(nome ? query : {}, skip, limit)
                } catch (err) {
                    return Boom.internal();
                }

            }
        }
    }
    create() {
        return {
            path: '/users',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastra um heroi, com nome e poder',
                notes: 'Com o method POST você DEVE enviar um nome e um poder',
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form',
                        responses: {
                            500: { 'description': 'Internal error' },
                            400: { 'description': 'BadRequest' },
                            200: { 'description': 'Ok' }
                        }
                    }
                },
                validate: {
                    failAction,
                    headers,
                    headers,
                    payload: Joi.object({
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(100),
                    })
                }
            },
            handler: async(request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })
                    return {
                        _id: result._id,
                        message: _message
                    }
                } catch (err) {
                    return Boom.internal();
                }
            }
        }
    }

    update() {
        return {
            path: '/users/{id}',
            method: 'PATCH',
            options: {
                tags: ['api'],
                description: 'Atualiza o nome ou o poder ou os dois',
                notes: 'Os dados são strings e tem um minimo de 3 e um max de 100',
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form',
                        responses: {
                            500: { 'description': 'Internal error' },
                            400: { 'description': 'BadRequest' },
                            200: { 'description': 'Ok' }
                        }
                    }
                },
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100),
                    })
                }
            },
            handler: async(request) => {
                try {
                    const { id } = request.params
                    const { payload } = request
                    const dadoString = JSON.stringify(payload)
                    const dados = JSON.parse(dadoString)
                    const result = await this.db.update(id, dados)
                    if (result.nModified !== 1) {
                        return Boom.preconditionFailed('Id não encontrado')
                    } else {
                        return {
                            message: _message
                        }
                    }

                } catch (error) {
                    return Boom.internal();
                }
            }
        }
    }

    delete() {
        return {
            path: '/users/{id}',
            method: 'DELETE',
            options: {
                tags: ['api'],
                description: 'Deleta um heroi pelo id',
                notes: 'O id tem que ser válido',
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form',
                        responses: {
                            500: { 'description': 'Internal error' },
                            400: { 'description': 'BadRequest' },
                            200: { 'description': 'Ok' }
                        },
                    }
                },
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async(request) => {
                try {
                    const { id } = request.params
                    const result = await this.db.delete(id)

                    if (result.n === 0) {
                        return Boom.preconditionFailed('Id não encontrado')
                    } else {
                        return { message: _message }
                    }


                } catch (error) {
                    return Boom.internal();
                }
            }
        }
    }
}
module.exports = HeroRoutes