const {Schema,model} = require('mongoose');

const pedidoSchema = new Schema({
    productos:{type:Array,required:true},
    total:{type:Number,required:true},
    cliente:{
        type:Schema.Types.ObjectId,
        ref:'cliente',
        required:true
    },
    vendedor:{
        type:Schema.Types.ObjectId,
        ref:'usuario',
        required:true
    },
    estado:{type:String,default:'Pendiente',enum:['Pendiente','Completado','Cancelado']}    
},{timestamps:true});

module.exports = model('pedido',pedidoSchema);

