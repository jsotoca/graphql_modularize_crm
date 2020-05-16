if(process.env.NODE_ENV!=='production') require('dotenv').config();

module.exports ={
    MONGO_URI:process.env.MONGO_URI,
    TOKEN_SECRET:process.env.TOKEN_SECRET,
    APPLICACTION_NAME:process.env.APPLICACTION_NAME
}