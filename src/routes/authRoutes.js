const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')


const failAction = (request, headers, error) => {
    return error
}
const USER = {
    username: 'xuxa',
    password: '1234'
}

class AuthRoutes extends BaseRoute {
    constructor(db, secret) {
        super()
        this._db = db
        this._secret = secret


    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter login JWT',
                notes: "Faz login com user e senha do banco usando o bcrypt",
                plugins: {
                    payloadType: 'form',
                    'hapi-swagger': {
                        responses: {
                            500: { 'description': 'Retorna um erro do servidor, algo não saiu como planejado' },
                            400: { 'description': 'Uma má requisição foi feita, todos os paramentros devem ser enviados username min 3 max 15 e senha min 3 max 8' },
                            200: { 'description': 'Pode comemorar por que deu tudo certo e um token foi retornado para você utilizar na api' }
                        }
                    }
                },
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().min(3).max(15).required(),
                        password: Joi.string().min(3).max(8).required(),
                    })
                }
            },
            handler: async(request) => {
                const { username, password } = request.payload
                const [user] = await this._db.read({ username: username.toLowerCase() })
                    //console.log(user);

                if (!user)
                    return Boom.unauthorized('Usuário inexistente')

                const match = await PasswordHelper.comparePassword(password, user.password)
                if (!match)
                    return Boom.unauthorized('Usuário/Senha inválidos')

                const token = Jwt.sign({
                    username: username,
                    id: user.id
                }, this._secret)
                return { token }
            }
        }
    }


}
module.exports = AuthRoutes