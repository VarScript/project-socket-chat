const { Schema, model } = require('mongoose');



const RoleSchema = Schema ({
    rol: {
        type: String,
        require: [true, 'the rol is required']
    }
});



module.exports = model( 'Role', RoleSchema );