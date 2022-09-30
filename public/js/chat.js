const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:8080/api/auth/' 
    : 'https://restserver-nodejs-varscrip.herokuapp.com/api/auth/';


let user = null;
let socket = null;

// Reference HTML
const txtUid       = document.querySelector('#txtUid');
const txtMessage   = document.querySelector('#txtMessage');
const ulUsers      = document.querySelector('#ulUsers');
const ulMessage    = document.querySelector('#ulMessage');
const ulMessagePv  = document.querySelector('#ulMessagePv');
const btnExit      = document.querySelector('#btnExit');



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

    socket.on('recive-message', drawMessage);
    
    socket.on('message-private', drawPrivateMessage);

    socket.on('user-active', drawUsers );

}



const drawUsers = ( users = [] ) => {
    let usersHtml = '';
    users.forEach( ({ name, uid }) => {

        usersHtml += `
        <li class="mb-5">
            <p>
                <h5 class="text-primary fw-semibold">${ name }</h5>
                <span class="text-dark">${ uid }</span>
            </p>
        </li>
        `;
    });

    ulUsers.innerHTML = usersHtml;
}



const drawMessage = ( message = [] ) => {
    let messageHtml = '';
    message.forEach( ({ name, message }) => {

        messageHtml += `
        <li class="list-unstyled">
            <p>
                <span class="text-primary fw-semibold">${ name }: </span>
                <span>${ message }</span>
            </p>
        </li>
        `;
    });

    ulMessage.innerHTML = messageHtml;
    
}

const drawPrivateMessage = ( {message, since} ) => {
    let messageHtml = '';
    let arr = [{since, message}];
    arr.forEach( ({since, message}) => {

        messageHtml = `
        <li>
            <p>
                <span class="text-primary fw-semibold">${ since }: </span>
                <span>${ message }</span>
            </p>
        </li>
        `;
    });

    ulMessagePv.innerHTML = messageHtml;
}


const button = document.getElementById('btnExit');
    button.onclick = () => {
        console.log( google.accounts.id )
        google.accounts.id.disableAutoSelect()

        google.accounts.id.revoke( localStorage.getItem( 'email' ), done => {
            localStorage.clear();
            location.reload();
        });
    }



txtMessage.addEventListener('keyup', ({ keyCode }) => {
    const message = txtMessage.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ) { return; }
    if( message.length === 0 ) { return; }
    
    socket.emit('send-message', { message, uid } );
    txtMessage.value = '';
});


const main = async() => {
    // Validate JWT
    await validateJWT();
}

main();
