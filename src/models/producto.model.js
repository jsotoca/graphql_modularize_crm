const {Schema,model} = require('mongoose');

const productoSchema = new Schema({
    nombre:{type:String,required:[true,'name is required'],trim:true},
    stock:{type:Number,required:[true,'stock is required']},
    precio:{type:Number,required:[true,'price is required']},
    status:{type:Boolean,default:true},
},{timestamps:true});

productoSchema.index({nombre:'text'});

module.exports = model('producto',productoSchema);

