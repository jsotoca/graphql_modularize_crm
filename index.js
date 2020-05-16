const server = require('./src/server');
const {PORT,MONGODB_URI,APPLICACTION_NAME} = require('./src/config');
const mongoose = require('mongoose');

mongoose.connect(
    MONGODB_URI,
    {useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false},
    (err)=>{
        if(err)throw err;
        server.listen({port:PORT}).then(({url})=>{
            console.log(`${APPLICACTION_NAME} is running in ${url}`);
        });
    }
);