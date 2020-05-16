const {gql} = require('apollo-server');
const {ClienteModel} = require('../models');
const {_err} = require('../helpers');

const typeDefs = gql`
    type Query{
        obtenerClientes:[Cliente]
        obtenerClientesPorVendedor:[Cliente]
        obtenerCliente(_id:ID!):Cliente
    }
    type Mutation{
        crearCliente(input:ClienteInput!):Cliente
        actualizarCliente(_id:ID!,input:ClienteInput!):Cliente
        eliminarCliente(_id:ID!):Cliente
    }
    type Cliente{
        id:ID
        nombre:String
        empresa:String
        email:String
        telefono:String
        vendedor:ID
        status:Boolean
        createdAt:String
        updatedAt:String
    }
    input ClienteInput{
        nombre:String!
        empresa:String!
        email:String!
        telefono:String!
        vendedor:ID
    }
`;

const resolvers = {
    Query:{
        obtenerClientes: async()=>{
            return await ClienteModel.find({});
        },
        obtenerClientesPorVendedor: async(_,{},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor) _err('id del creador no enviado');
            else{
                return await ClienteModel.find({vendedor});
            }
        },
        obtenerCliente:async(_,{_id},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor)_err(400,'id del vendedor no enviado');
            else{
                const cliente = await ClienteModel.findById(_id);
                if(!cliente) _err(400,'cliente no encontrado');
                if(cliente.vendedor.toString() !== vendedor)_err(400,'vendedor no valido');
                return cliente;
            }
        }
    },
    Mutation:{
        crearCliente: async(_,{input},ctx)=>{
            if(!ctx) _err('id del creador no subministrado');
            else{
                input.vendedor = ctx._id;
                const cliente = new ClienteModel(input);
                await cliente.save();
                return cliente;
            }
        },
        actualizarCliente: async(_,{_id,input},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor)_err(400,'error con vendedor');
            let cliente = await ClienteModel.findById(_id);
            if(!cliente)_err(400,'error con el cliente');
            if(cliente.vendedor.toString() !== vendedor )_err(400,'error con el vendedor **');
            cliente = await ClienteModel.findByIdAndUpdate(_id,input,{new:true,runValidators:true});
            return cliente;
        },
        eliminarCliente: async(_,{_id},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor)_err(400,'error con vendedor');
            let cliente = await ClienteModel.findById(_id);
            if(!cliente)_err(400,'error con el cliente');
            if(cliente.vendedor.toString() !== vendedor )_err(400,'error con el vendedor **');
            cliente = await ClienteModel.findByIdAndUpdate(_id,{status:false},{new:true,runValidators:true});
            return cliente;
        }
    }
}

module.exports ={
    typeDefs,
    resolvers
}