const {Schema,model} = require('mongoose');

const clienteSchema = new Schema({
    nombre:{type:String,required:[true,'name is required'],trim:true},
    empresa:{type:String,required:[true,'name is required'],trim:true},
    telefono:{type:String,required:[true,'name is required'],trim:true,unique:true},
    email:{type:String,required:[true,'name is required'],trim:true,unique:true},
    status:{type:Boolean,default:true},
    vendedor:{
        type:Schema.Types.ObjectId,
        ref:'usuario',
        required:[true,'el id del vendedor es necesario']
    }
},{timestamps:true});

module.exports = model('cliente',clienteSchema);

