const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HeroRoute = require('./src/routes/heroRoutes');
const AuthRouts = require('./src/routes/authRoutes')
const HapiJwt = require('hapi-auth-jwt2')
const Context = require('./src/db/base/context');
const MongoDB = require('./src/db/mongo/mongo');
const HeroSchema = require('./src/db/mongo/schemas/heroSchema');
const AuthSchema = require('./src/db/mongo/schemas/authSchema');



const JWT_SECRET = 'pao-de-batata'

function mapRoutes(instance, methods) {
    return methods.map(m => instance[m]())
}
const app = new Hapi.Server({
    port: 5000
})

async function main() {

    const connection = MongoDB.connect()
        //TABELA USER
    const mongoDb = new Context(new MongoDB(connection, HeroSchema))
        //TABELA AUTH
    const auth = new Context(new MongoDB(connection, AuthSchema))

    //DOCUMENTATION
    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: '5.14.3',
            contact: {
                name: 'Paulo Oliveira',
                email: 'paulosoujava@gmail.com'
            },

        }
    }
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiersIn: 20
        // }
        validate: async(dado, request) => {
            //verificacoes no banco se usuario continua ativo, se pagamento em dia etc...
            //console.log("DADOS", dado);

            const [result] = await auth.read({
                username: dado.username,
            })
            if (!result)
                return { isValid: false }

            return { isValid: true }

        }
    })
    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoute(mongoDb), HeroRoute.methods()),
        ...mapRoutes(new AuthRouts(auth, JWT_SECRET), AuthRouts.methods())
    ])

    await app.start()
    console.log('Server running on port %s\n\n', app.info.port);
    return app;
}

module.exports = main()



// const init = async() => {

//     const server = Hapi.server({
//         port: 5000,
//         host: 'localhost'
//     });

//     const swaggerOptions = {
//         'info': {
//             'title': 'Test API Documentation',
//             'version': '5.14.3',
//             'contact': {
//                 'name': 'Glenn Jones',
//                 'email': 'glenn@example.com'
//             },
//         },
//         'schemes': ['https'],
//         'host': 'example.com',
//         tags: [{
//                 name: 'users',
//                 description: 'Users data'
//             },
//             {
//                 name: 'store',
//                 description: 'Storing a sum',
//                 externalDocs: {
//                     description: 'Find out more about storage',
//                     url: 'http://example.org'
//                 }
//             },
//             {
//                 name: 'sum',
//                 description: 'API of sums',
//                 externalDocs: {
//                     description: 'Find out more about sums',
//                     url: 'http://example.org'
//                 }
//             }
//         ]
//     }
//     await server.register([
//         Inert,
//         Vision,
//         {
//             plugin: HapiSwagger,
//             options: swaggerOptions
//         }
//     ]);

//     console.log(mapRoutes(new HeroRoute(FAKE_DATA), HeroRoute.methods()));


//     server.route([
//         ...mapRoutes(new HeroRoute(FAKE_DATA), HeroRoute.methods())
//     ])

//     await server.start();
//     console.log('Server running on %s', server.info.uri);
// };

// process.on('unhandledRejection', (err) => {

//     console.log(err);
//     process.exit(1);
// });

// init();