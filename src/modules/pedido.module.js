const {gql} = require('apollo-server');
const {ProductoModel,ClienteModel,PedidoModel} = require('../models');
const {_err} = require('../helpers');

const typeDefs = gql`
    extend type Query{
        obtenerPedidos:[Pedido]
        obtenerPedido(_id:ID!):Pedido
        obtenerPedidosPorVendedor:[Pedido]
        obtenerPedidosPorEstado(estado:String!):[Pedido]
    }
    extend type Mutation{
        crearPedido(input:PedidoInput!):Pedido
        actualizarPedido(_id:ID!,input:PedidoInput):Pedido
        eliminarPedido(_id:ID!):Pedido
    }

    type Pedido{
        _id:ID
        productos:[PedidoProductos]
        cliente:ID
        total:Float
        vendedor:ID
        estado:EstadoPedido
        createdAt:String
        updatedAt:String
    }
    type PedidoProductos{
        _id:ID
        cantidad:Int
    }
    input PedidoInput{
        productos:[PedidoProductoInput]
        total:Float
        cliente:ID!
        estado:EstadoPedido
    }

    input PedidoProductoInput{
        _id:ID!
        cantidad:Int
    }

    enum EstadoPedido{
        Pendiente
        Completado
        Cancelado
    }
`;

const resolvers ={
    Query:{
        obtenerPedidos: async()=>{
            return await PedidoModel.find({});
        },
        obtenerPedidosPorVendedor: async(_,{},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor)_err(400,'vendedor no encontrado');
            const pedidos = await PedidoModel.find({vendedor});
            return pedidos;
        },
        obtenerPedidosPorEstado: async(_,{estado},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor)_err(400,'vendedor no encontrado');
            const pedidos = await PedidoModel.find({vendedor,estado});
            return pedidos;
        },
        obtenerPedido: async(_,{_id},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor)_err(400,'vendedor no encontrado');
            const pedido = await PedidoModel.findById(_id);
            if(!pedido)_err(400,'pedido no encontrado');
            if(pedido.vendedor.toString() !== vendedor)_err(400,'pedido no asignado a este vendedor');
            return pedido;
        }
    },
    Mutation:{
        crearPedido: async(_,{input},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor) _err(400,'vendedor no registrado');
            else {
                const cliente = await ClienteModel.findById(input.cliente);
                if(!cliente) _err(400,'cliente no encontrado');
                if(cliente.vendedor.toString() !== vendedor) _err(400,'cliente no asignado a este vendedor');
                for await ( const articulo of input.productos){
                    const {_id} = articulo;
                    const producto = await ProductoModel.findById(_id);
                    if(articulo.cantidad > producto.stock)_err(400,'el stock es mayor a la cantidad');
                    else{
                        producto.stock -= articulo.cantidad;
                        await producto.save(); 
                    }
                }
                input.vendedor = vendedor;
                const nuevoPedido = new PedidoModel(input);
                return await nuevoPedido.save();
            }
        },
        actualizarPedido: async(_,{_id,input},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor)_err(400,'vendedor no encontrado');
            const pedido = await PedidoModel.findById(_id);
            if(!pedido)_err(400,'pedido no encontrado');
            const cliente = await ClienteModel.findById(pedido.cliente);
            if(!cliente)_err(400,'cliente no encontrado');
            if(pedido.vendedor.toString() !== vendedor)_err(400,'pedido no asignado a este vendedor');
            let index = 0;
            if(input.productos){
                for await ( const articulo of input.productos){
                    const {_id} = articulo;
                    const producto = await ProductoModel.findById(_id);
                    if(articulo.cantidad > (producto.stock+pedido.productos[index].cantidad))_err(400,'el stock es mayor a la cantidad');
                    else{
                        producto.stock -= (articulo.cantidad - pedido.productos[index].cantidad);
                        await producto.save(); 
                    }
                    index++;
                }
            }
            return await PedidoModel.findByIdAndUpdate(_id,input,{new:true});
        },
        eliminarPedido: async(_,{_id},ctx)=>{
            const vendedor = ctx._id;
            if(!vendedor) _err(400,'vendedor no registrado');
            else {
                const pedido = await PedidoModel.findById(_id);
                if(!pedido) _err(400,'pedido no encontrado');
                if(pedido.vendedor.toString() !== vendedor) _err(400,'cliente no asignado a este vendedor');
                for await ( const articulo of pedido.productos){
                    const {_id} = articulo;
                    const producto = await ProductoModel.findById(_id);
                    producto.stock += articulo.cantidad;
                    await producto.save(); 
                }
                return await PedidoModel.findByIdAndDelete(_id);
            }
        },
    }
}

module.exports = {
     typeDefs,
     resolvers
}