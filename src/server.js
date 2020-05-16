const {ApolloServer} = require('apollo-server');
const {UsuarioModule,ProductoModule,ClienteModule} = require('./modules');
const {_err,decodedToken} = require('./helpers');

const server = new ApolloServer({
    modules:[
        UsuarioModule,
        ProductoModule,
        ClienteModule
    ],
    context: async({req})=>{
        const token = req.headers['authorization'];
        if(token){
            const {_id} = decodedToken(token);
            if(!_id)_err(400,'token invalido');
            return {
                _id
            }
        }
    }
});

module.exports = server;
