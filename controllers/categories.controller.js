const { response } = require("express");

const { Category } = require("../models");





// GET categories - Paginated - Total - Populate

const categoriesGet = async (req, res = response) => {

    const { limit = 5, since = 0} = req.query;
    const query = { status: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number( since ))
            .limit(Number( limit ))
    ]);

    res.json({
        total, 
        categories 
    })

}



// GET category by id - populate
const categoriesGetById = async (req, res = response) => {

    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    res.json(category)
}




// Create category
const createCategory = async (req, res = response) => {

    try {
        const name = req.body.name.toUpperCase();
    
        const categoryDB = await Category.findOne({ name });
    
        if ( categoryDB ) {
            return res.status(401).json({
                msg: `The category ${ categoryDB.name }, already exist`
            });
        }
    
        // Generate the data to save 
    
        const data = {
            name,
            user: req.user._id,
        }
    
        const category = new Category( data );
        
        // Save in DB
        await category.save();

        res.status(201).json( category );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Has occurred a error to the create category'
        });
    }

}



// Update category
const updateCategory = async (req, res = response) => {
    // Validate Name 
    const name = req.body.name.toUpperCase();
    
        const categoryDB = await Category.findOne({ name });
    
        if ( categoryDB ) {
            return res.status(401).json({
                msg: `The category ${ categoryDB.name }, already exist`
            });
        }
    
    // For recive the id and name in the URL
    const { id } = req.params;
    const { _id, user, ...rest } = req.body;

    rest.name = rest.name.toUpperCase();
    rest.user = req.user.id;

    const category = await Category.findByIdAndUpdate(id, rest, { new: true });
    

    res.json(category);
}


// Delete category - status: false

const categoryDelete = async (req, res = response) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true })

    res.json(category);

}



module.exports = {
    categoriesGet,
    categoriesGetById,
    createCategory,
    updateCategory,
    categoryDelete
}