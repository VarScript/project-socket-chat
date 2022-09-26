// Destructuring something that go in of the package of express
const { Router } = require('express');
const { check } = require('express-validator');


const {
    validateFields,
    validateJWT,
    isAdminRole,
    haveRole
} = require('../middlewares')


const { isRolValidate,
        ifEmailExist,
        existUserById 
} = require('../helpers/db-validators');


const { userGet,
        userPut,
        userPost,
        userPatch,
        userDelete 
} = require('../controllers/users.controllers');

const router = Router();



// here it call the reference of the same 
router.get('/', userGet );



router.put('/:id', [
    check('id', 'Not is an ID validate').isMongoId(),
    check('id').custom( existUserById ),
    check('rol').custom( isRolValidate ),
    validateFields
],userPut );



router.post('/', [
    check('name', 'The name is require').not().isEmpty(),
    check('password', 'The password have that be more of six letters').isLength({ min:6 }),
    check('email').custom( ifEmailExist),
    //check('rol', 'Not is validate rol').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( isRolValidate ),
    validateFields  
], userPost );



router.delete('/:id',[
    validateJWT,
    //isAdminRole,
    haveRole('ADMIN_ROLE', 'SALES_ROLE', 'USER_ROLE'),
    check('id', 'Not is an ID validate').isMongoId(),
    check('id').custom( existUserById ),
    validateFields
] , userDelete );



router.patch('/', userPatch );



module.exports = router;