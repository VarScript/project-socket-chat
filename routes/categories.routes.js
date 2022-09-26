const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const { 
    categoriesGet,
    categoriesGetById,
    createCategory,
    updateCategory,
    categoryDelete, 
} = require('../controllers/categories.controller');

const { existCategoryById } = require('../helpers/db-validators');

const router = Router();



// {{url}}/api/categories


// Get all categories - Public
router.get('/', categoriesGet );


// Get all categories for id - Public
router.get('/:id', [
    check('id', 'Not is an ID validate').isMongoId(),
    check('id').custom( existCategoryById ),
    validateFields
], categoriesGetById);


// Create category - private - Any person with a token valid
router.post('/', [ 
    validateJWT,
    check('name', 'The name is require').not().isEmpty(),
    validateFields
], createCategory );


// Update - private - Any person with a token valid
router.put('/:id', [
    validateJWT,
    check('name', 'The name is require').not().isEmpty(),
    check('id', 'Not is an ID validate').isMongoId(),
    check('id').custom( existCategoryById ),
    validateFields
], updateCategory);

// Delete a category - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not is an ID validate').isMongoId(),
    check('id').custom( existCategoryById ),
    validateFields
], categoryDelete);



module.exports = router;