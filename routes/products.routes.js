const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validateFields,
    validateJWT,
    isAdminRole
} = require('../middlewares');

const{
    productsGet,
    productsGetId,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/products.controller');

const { existProductById, existCategoryById } = require('../helpers/db-validators');




const router = Router();



// GET all products
router.get('/', productsGet);



// GET all products by ID
router.get('/:id', [
    check('id', 'Not is an ID validate').isMongoId(),
    check('id').custom( existProductById ),
    validateFields
], productsGetId);



// Create products - Any person with a token valid
router.post('/', [
    validateJWT,
    check('name', 'The name is require').not().isEmpty(),
    check('category', 'The id category is necessary').isMongoId(),
    check('category').custom( existCategoryById ),
    validateFields
], createProduct);



// Update - Any person with a token valid
router.put('/:id', [
    validateJWT,
    check('name', 'The name is require').not().isEmpty(),
    check('id', 'Not is an ID validate').isMongoId(),
    check('id').custom( existProductById ),
    validateFields,
], updateProduct);



// Delete a category - Only Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not is an ID validate').isMongoId(),
    check('id').custom( existProductById ),
    validateFields,
], deleteProduct);


module.exports = router;








