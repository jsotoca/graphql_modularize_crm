const {Schema,model} = require('mongoose');
const {genSaltSync,hashSync,compareSync} = require('bcryptjs');

const usuarioSchema = new Schema({
    nombre:{type:String,required:[true,'name is required'],trim:true},
    email:{type:String,required:[true,'email is required'],unique:true},
    password:{type:String,required:[true,'password is required']},
    avatar:{type:String,default:'av-01.png'},
    status:{type:Boolean,default:true},
},{timestamps:true});

usuarioSchema.pre('save',function(next){
    if(!this.isModified('password')) return next;
    const salt = genSaltSync(10);
    const passwordHash = hashSync(this.password,salt);
    this.password = passwordHash;
    next();
});

usuarioSchema.methods.toJSON = function(){
    let usuario = this.toObject();
    delete usuario.password;
    return usuario;
}

usuarioSchema.methods.comparePasswords = function(password){
    return compareSync(password,this.password);
}

module.exports = model('usuario',usuarioSchema);

