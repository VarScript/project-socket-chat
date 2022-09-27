const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:8080/api/auth/' 
    : 'https://restserver-nodejs-varscrip.herokuapp.com/api/auth/';


let user = null;
let socket = null;

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
    console.log(userDB, tokenBD);
    localStorage.setItem('token', tokenBD);
    user = userDB;
}

const main = async() => {
    // Validate JWT
    await validateJWT();
}

main();

// const chat = io();