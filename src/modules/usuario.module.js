const {gql} = require('apollo-server');
const {UsuarioModel} = require('../models');
const {_err,generateToken,decodedToken} = require('../helpers');

const typeDefs = gql`
    extend type Query{
        obtenerUsuario(token:String):ID
    }
    extend type Mutation{
        signUp(input: SignUpInput!):Token
        signIn(input: SignInInput!):Token
    }
    type Token{
        token:String
    }
    type Usuario{
        nombre:String
        email:String
    }
    input SignUpInput{
        nombre:String!
        email:String!
        password:String!
        avatar:String
    }
    input SignInInput{
        email:String!
        password:String!
    }
`;

const resolvers = {
    Query: {
        obtenerUsuario: async(_,{token})=>{
            const {_id} = decodedToken(token);
            if(!_id)_err('token incorrecto');
            return _id;
        }
    },
    Mutation: {
        signUp: async(_,{input})=>{
            const {email} = input;
            const usuarioExiste = await UsuarioModel.findOne({email});
            if(usuarioExiste)_err(400,'usuario ya registrado en la base de datos.');
            const usuarioNuevo = new UsuarioModel(input);
            await usuarioNuevo.save();
            const token = generateToken(usuarioNuevo._id);
            return {token};
        },
        signIn: async(_,{input})=>{
            const {email,password} = input;
            const usuarioExiste = await UsuarioModel.findOne({email});
            if(!usuarioExiste)_err(400,'email y/o contraseña incorrectos *.');
            if(!usuarioExiste.comparePasswords(password))_err(400,'email y/o contraseña incorrectos **.');
            const token = generateToken(usuarioExiste._id);
            return {token};
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}