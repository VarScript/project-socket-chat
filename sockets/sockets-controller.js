const  { Socket }     = require('socket.io');
const { checkJWT }    = require("../helpers");
const { ChatMessage } = require('../models');

const chatMessage = new ChatMessage();


const socketController = async( socket = new Socket(), io ) => {
    const user = await checkJWT(socket.handshake.headers['x-token']);
    if ( !user ) {
        return socket.disconnect();
    }

    // Add user connected
    chatMessage.connectUser( user );
    io.emit('user-active', chatMessage.usersArr );

    // clean user discconect
    socket.on('disconnect', () =>{
        chatMessage.disconnectUser( user.id );
        io.emit('user-active', chatMessage.usersArr );

    })
}

module.exports = {
    socketController
}