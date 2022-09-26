const { response } = require("express");

const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');
const product = require("../models/product");

const permittedCollection = [
    'users',
    'categories',
    'products',
    'role'
];

const searchUsers = async ( term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term ); 

    if ( isMongoId ){
        const user = await User.findById( term );
        
        if (user.status === false) return res.json({ result: [] });
        else return res.json({ result: ( user ) ? [ user ] : [] });
    }   
    
    // RegExp is a regular expression that serve for that be an insensitive to the capital latter and lower case
    const regex = new RegExp(term, 'i')
    const usersC = await User.count({ 
        $or: [{ name: regex  }, { email: regex }],
        $and: [{ status: true }]
    });
    const users = await User.find({ 
        $or: [{ name: regex  }, { email: regex }],
        $and: [{ status: true }]
    });
    res.json({result: usersC, users});
}



const searchCategories = async ( term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term ); 

    if ( isMongoId ){
        const category = await Category.findById( term ).populate('user', 'name');

        if (category.status === false) return res.json({ result: [] });
        else return res.json({ result: category });
    }   
    
    // RegExp is a regular expression that serve for that be an insensitive to the capital latter and lower case
    const regex = new RegExp(term, 'i')
    const categoryC = await Category.count({ name: regex, status: true })
                            .populate('user', 'name');
    const category = await Category.find({ name: regex, status: true })
                            .populate('user', 'name');

    res.json({result: categoryC, category});
}



const searchProducts = async ( term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term ); 

    if ( isMongoId ){
        const product = await Product.findById( term ).populate('category', 'name');

        if (product.status === false) return res.json({ result: [] })
        else return res.json({ result:product });
    }   
    
    // RegExp is a regular expression that serve for that be an insensitive to the capital latter and lower case
    const regex = new RegExp(term, 'i')
    const productC = await Product.count({  name: regex ,status: true })
                            .populate('category', 'name');
    const product = await Product.find({  name: regex ,status: true })
                            .populate('category', 'name');

    res.json({result: productC, product});
}




const search = (req, res= response) => {

    const { collection, term } = req.params;

    if ( !permittedCollection.includes( collection ) ) {
        return res.status(400).json({
            msg: `The permitted collection are: ${ permittedCollection }`
        });
    }
    
    switch ( collection ) {
        case 'users':
            searchUsers(term, res)
        break;
        case 'categories':
            searchCategories(term, res)
        break;
        case 'products':
            searchProducts(term, res)
        break;

        default:
            res.status(500).json({
                msg: 'I forget implement this search'
            });
    }
}

module.exports = {
    search
}