const {gql} = require('apollo-server');
const {ProductoModel} = require('../models');
const {_err} = require('../helpers');

const typeDefs = gql`
    extend type Query{
        obtenerProductos:[Producto]
        obtenerProducto(_id:ID!):Producto
    }
    extend type Mutation{
        crearProducto(input:ProductoInput!):Producto
        actualizarProducto(_id:ID!,input:ProductoInput!):Producto
        eliminarProducto(_id:ID!):Producto
    }
    type Producto{
        _id:ID,
        nombre:String
        stock:Int
        precio:Float
        status:Boolean
        createdAt:String
        updatedAt:String
    }
    input ProductoInput{
        nombre:String!
        stock:Int!
        precio:Float!
    }
`;

const resolvers = {
    Query:{
        obtenerProductos: async()=>{
            return await ProductoModel.find({});
        },
        obtenerProducto: async(_,{_id})=>{
            const producto = await ProductoModel.findById(_id);
            if(!producto)_err(404,'producto no encontrado');
            return producto;
        }
    },
    Mutation: {
        crearProducto: async(_,{input})=>{
            const producto = new ProductoModel(input);
            await producto.save();
            return producto;
        },
        actualizarProducto: async(_,{_id,input})=>{
            let producto = await ProductoModel.findById(_id);
            if(!producto)_err(404,'producto no encontrado');
            return await ProductoModel.findByIdAndUpdate(_id,input,{new:true,runValidators:true});
        },
        eliminarProducto: async(_,{_id})=>{
            let producto = await ProductoModel.findById(_id);
            if(!producto)_err(404,'producto no encontrado');
            return await ProductoModel.findByIdAndUpdate(_id,{status:false},{new:true,runValidators:true});
        }
    }
};

module.exports ={
    typeDefs,
    resolvers
}