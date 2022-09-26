const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares');

const { login, googleSingIn } = require('../controllers/auth.controller');

const router = Router();



router.post('/login',[
    check('email', 'The Email is required').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validateFields
], login );



router.post('/google',[
    check('id_token', 'The id_token is necessary').not().isEmpty(),
    validateFields
], googleSingIn );



module.exports = router;