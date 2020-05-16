const server = require('./src/server');
const {MONGO_URI,APPLICACTION_NAME} = require('./src/config');
const mongoose = require('mongoose');

mongoose.connect(
    MONGO_URI,
    {useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false},
    (err)=>{
        if(err)throw err;
        server.listen().then(({url})=>{
            console.log(`${APPLICACTION_NAME} is running in ${url}`);
        });
    }
);