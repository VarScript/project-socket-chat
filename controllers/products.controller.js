const { response } = require('express');

const { Product } = require('../models');



// GET all products
const productsGet = async (req, res = response) => {

    const { limit = 5, since = 0 } = req.query;
    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .skip(Number( since ))
        .limit(Number( limit ))
        .populate('user', 'name')
        .populate('category', 'name')
    ]);

    res.json({
        total,
        products
    });

} 



// GET all products by ID
const productsGetId = async (req, res = response) => {
    
    const { id }= req.params;

    const product = await Product.findById(id)
                                    .populate('user', 'name')
                                    .populate('category', 'name');

    res.json(product);

}



// Create products - Any person with a token valid
const createProduct = async (req, res = response) => {
    
    const { status, user, ...body } = req.body;
    // IF the category is active
    const name = body.name.toUpperCase();
    
    const productDb = await Product.findOne({ name });

    if ( productDb ) {
        return res.status(401).json({
            msg: `The Product ${ productDb.name }, already exist`
        });
    }

    // Generate the data to save 

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }

    const product = new Product( data );

    // Save in Db
    await product.save();

    res.status(201).json( product );

}



// Update - Any person with a token valid
const updateProduct = async (req, res = response) => {

    // IF the category is active
    const name = req.body.name.toUpperCase();
    
    const productDb = await Product.findOne({ name });

    if ( productDb ) {
        return res.status(401).json({
            msg: `The Product ${ productDb.name }, already exist`
        });
    }

    const { id } = req.params;
    const { _id, user, ...rest } = req.body;

    rest.name = rest.name.toUpperCase();
    rest.user = req.user.id;

    const product = await Product.findByIdAndUpdate(id, rest, { new: true });

    res.json(product);

}



// Delete a product - Only Admin
const deleteProduct = async (req, res = response) => {
    
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(product);

}




// - 

module.exports = {
    productsGet,
    productsGetId,
    createProduct,
    updateProduct,
    deleteProduct
}