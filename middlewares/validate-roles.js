const { response } = require("express")



const isAdminRole = ( req, res =response, next) => {

    if ( !req.user ) {
        return res.status(500).json({
            msg: 'It want verify the role without validate token first'
        });
    }

    const { rol, name } = req.user;

    if (rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } is not administrator - Cannot make this`
        })
    }

    next();
}



const haveRole = ( ...roles ) => {
    return ( req, res =response, next) => {

        if ( !req.user ) {
            return res.status(500).json({
                msg: 'It want verify the role without validate token first'
            });
        }

        if ( !roles.includes( req.user.rol ) ) {
            return res.status(401).json({
                msg: `The service require one of these roles ${ roles }`
            });
        }

        next();
    }
}



module.exports = {
    isAdminRole,
    haveRole
}