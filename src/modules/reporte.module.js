const {gql} = require('apollo-server');
const {ProductoModel,PedidoModel} = require('../models');

const typeDefs = gql`
    extend type Query{
        mejoresClientes:[TopCliente]
        mejoresVendedores: [TopVendedor]
        buscarProducto(texto:String!):[Producto]
    }
    type TopCliente{
        cliente:[Cliente]
        total:Float
    }
    type TopVendedor{
        vendedor:[Usuario]
        total:Float
    }
`;

const resolvers = {
    Query:{
        mejoresClientes: async()=>{
            const clientes = await PedidoModel.aggregate([
                {$match: {estado:"Completado"}},
                { $group: {
                    _id: "$cliente",
                    total: {$sum: '$total'}
                }},
                {
                    $lookup: {
                        from: 'clientes',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'cliente'
                    }
                },
                {
                    $sort:{ total: -1}
                }
            ]);
            return clientes;
        },
        mejoresVendedores: async()=>{
            const vendedores = await PedidoModel.aggregate([
                { $match: {estado:"Completado"}},
                { $group: {
                    _id: "$vendedor",
                    total: {$sum:'$total'}
                }},
                {
                    $lookup:{
                        from:'usuarios',
                        localField:'_id',
                        foreignField:'_id',
                        as: 'vendedor'
                    }
                },
                {
                    $limit: 5
                },
                {
                    $sort: { total:-1 }
                }
            ]);
            return vendedores;
        },
        buscarProducto: async(_,{texto})=>{
            const productos = await ProductoModel.find({$text:{$search:texto}});
            return productos;
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}