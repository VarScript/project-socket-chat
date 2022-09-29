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
    socket.emit('recive-message', chatMessage.last10);

    // connect special room
    socket.join( user.id ); // gobal, socket.id, user.id

    // clean user discconect
    socket.on('disconnect', () =>{
        chatMessage.disconnectUser( user.id );
        io.emit('user-active', chatMessage.usersArr );
    });


    socket.on('send-message', ({ uid, message }) => {

        if( uid ) {
            // Pivate massage
            socket.to( uid ).emit('message-private', { since: user.name, message });
        } else {
            chatMessage.sendMessage(user.id, user.name, message );
            io.emit('recive-message', chatMessage.last10 );
        }
    });

}

module.exports = {
    socketController
}