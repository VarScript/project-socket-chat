const { response, request } = require('express');

const jwt = require('jsonwebtoken');

const User = require('../models/user');


const validateJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');
    
    if ( !token ) {
        return res.status(401).json({
            msg: 'There is not token in the petition'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        // read User that corresponds
        const user = await User.findById( uid );

        if ( !user ){
            return res.status(401).json({
                msg: 'Token invalid - The User not exist in DB '
            })
        }
        
        // Verify if the uid have status true
        if ( !user.status ){
            return res.status(401).json({
                msg: 'Token invalid - User with status: false'
            })
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({
            msg: 'Invalid token'
        })
    }
}



module.exports = {
    validateJWT
}