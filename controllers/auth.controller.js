const { response, json } = require("express");
const bcryptjs = require('bcryptjs')


const User = require('../models/user');


const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");



const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        
        // Verify if the Email exist
        const user = await User.findOne({ email })
        if ( !user ) {
            return res.status(400).json({
                msg: 'User / Password are not corrects - Email'
            })
        }

        // If the user is active
        if ( !user.status ) {
            return res.status(400).json({
                msg: 'User / Password are not corrects - status: false'
            })
        }

        // Verify the password
        const validatePassword = bcryptjs  .compareSync( password, user.password) 
        if ( !validatePassword ){
            return res.status(400).json({
                msg: 'User / Password are not corrects - password'
            })
        }

        // Generate the JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'something went wrong'
        });
    }
}



const googleSingIn = async (req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { name, picture, email } = await googleVerify( id_token );
        
        let user = await User.findOne({ email });
        
        if ( !user ) {
            const data = {
                name,
                email,
                password: ':P',
                picture,
                rol: "USER_ROLE",
                google: true
            };

            user = new User( data );
            await user.save();
        }

        // If the User  in BD 
        if ( !user.status ) {
            return res.status(401).json({
                mgs: 'Talk with the Administrator, user blocked'
            });
        }

        // Generate the JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });


    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'The Token was could not verify'
        });
    }
}



module.exports = {
    login,
    googleSingIn
}