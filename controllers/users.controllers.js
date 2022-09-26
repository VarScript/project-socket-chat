const { response, request, query } = require('express');

const User = require('../models/user');

const bcryptjs = require('bcryptjs'); 



const userGet = async (req = request, res = response) => { 
    // reference: const { q, name = 'No mane', apikey, page = 2, limit } = req.query;

    const { limit = 5, since = 0} = req.query;
    const query = { status: true};

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number( since ))    
            .limit(Number( limit ))
    ]);

    // when is a json format it send an object
    res.json({ 
        total, 
        users
    });
}



const userPut = async (req = request, res = response) => {
    // For recive the id in the URL
    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;
    
    // ALL validate against database
    if ( password ) {
        // encrip password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt)
    }

    const user = await User.findByIdAndUpdate( id, rest, {new: true} );
    // when is a json format it send an object
    res.json(user);
}



const userPost = async (req = request, res = response) => { // create new resources
    // Recive the body in formart json of server
    const { name, email, password, rol } = req.body;
    const user = new User( { name, email, password, rol } ); 

    // encrip password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt)

    // save in db
    await user.save();
    // when is a json format it send an object
    res.json({ 
        user
    });
}



const userPatch = (req = request, res = response) => {
    // when is a json format it send an object
    res.json({ 
        msg: 'patch API - controller'
    });
}



const userDelete = async (req = request, res = response) => {
    
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { status: false })

    res.json(user);    
}



module.exports = {
    userGet,
    userPut,
    userPost,
    userPatch,
    userDelete
}