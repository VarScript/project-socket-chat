const { isValidObjectId } = require('mongoose');

const {
    User,
    Category,
    Role,
    Product
} = require('../models'); 



const isRolValidate =  async (rol = '') => {
    const existRole = await Role.findOne({ rol });
    if ( !existRole ) {
        throw new Error(`The Rol ${ rol } is not register in the DataBase`);
    }
}



const ifEmailExist = async (email = '') => {
        const existEmail = await User.findOne({ email });
        if ( existEmail ) {
            throw new Error(`The Email ${ email } it is already register`);
        }
}



const existUserById = async ( id = '' ) => {
    // User validation
    const existUser = await User.findById(id);
    if ( !existUser ) {
        throw new Error(`The ID: ${ id }, is not exist`);
    }
}


const existCategoryById = async ( id = '' ) => {
    // Category validator
    const existCategory = await Category.findById(id);

    if ( !existCategory ) {
        throw new Error(`The ID: ${ id }, is not exist`);
    }
}


const existProductById = async ( id = '' ) => {
    // Product validator
    const existProduct = await Product.findById(id);

    if ( !existProduct ) {
        throw new Error(`The ID: ${ id }, is not exist`);
    }
}

// validate permitted collection
const permittedCollection = ( collection = '', collections = [] ) => {

    const include = collections.includes( collection );
    if ( !include ) {
        throw new Error(`The collection ${ collection } is not permitted - Permitted collection ${ collections }`)
    }

    return true;
}



module.exports = {
    isRolValidate,
    ifEmailExist,
    existUserById,
    existCategoryById,
    existProductById,
    permittedCollection
}