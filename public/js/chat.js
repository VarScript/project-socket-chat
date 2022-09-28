const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:8080/api/auth/' 
    : 'https://restserver-nodejs-varscrip.herokuapp.com/api/auth/';


let user = null;
let socket = null;

// Reference HTML
const txtUid     = document.querySelector('#const txtUid');
const txtMessage = document.querySelector('#const txtMessage');
const ulUsers    = document.querySelector('#const ulUsers');
const ulMessage  = document.querySelector('#const ulMessage');
const btnExit    = document.querySelector('#const btnExit');

// validate the token of the localStorage
const validateJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('Have not token in the server');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { user: userDB, token: tokenBD  } = await resp.json();
    localStorage.setItem('token', tokenBD);
    user = userDB;
    document.title = user.name;
    
    await socketConnect();
}

const socketConnect = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Online');
    });

    socket.on('disconnect', () => {
        console.log('Offline');
    });

    socket.on('recive-message', () => {

    });

    socket.on('user-active', (payload) => {
        console.log(payload);
    });

    socket.on('message-private', () => {
        
    });
}

const main = async() => {
    // Validate JWT
    await validateJWT();
}

main();
