const mongoose = require('mongoose')



const dbConnection = async() => {
    try {
        // await: for to wait that the connection it's make
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Database online');

    } catch (error) {
        console.log(error);
        throw new Error('Error in the dabtabase')
    }
}



module.exports = {
    dbConnection
}