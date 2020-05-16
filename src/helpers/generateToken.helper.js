const {sign} = require('jsonwebtoken');
const {TOKEN_SECRET} = require('../config');

module.exports = function(_id,secret=null){
    const token = (secret)? secret:TOKEN_SECRET;
    return sign({_id},token,{expiresIn:'4h'});
}