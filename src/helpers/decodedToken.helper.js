const {verify} = require('jsonwebtoken');
const {TOKEN_SECRET} = require('../config');

module.exports = function(token,secret=null){
    const token_secret = (secret)? secret:TOKEN_SECRET;
    return verify(token,token_secret);
}