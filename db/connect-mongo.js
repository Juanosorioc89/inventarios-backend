const mongoose = require ('mongoose');

const getConnetion = async ()=>{

    try{
       
       const url = 'mongodb://user-iud:80hHnX1UJ21Q1CH9@ac-bubq7wc-shard-00-00.5t1yt19.mongodb.net:27017,ac-bubq7wc-shard-00-01.5t1yt19.mongodb.net:27017,ac-bubq7wc-shard-00-02.5t1yt19.mongodb.net:27017/jwt-inventarios?ssl=true&replicaSet=atlas-rreq6q-shard-0&authSource=admin&retryWrites=true&w=majority'

        await mongoose.connect(url);

        console.log('Conexión exitosa')

    }catch(error){
        console.log(error);


    }

}

module.exports= {
    getConnetion
}