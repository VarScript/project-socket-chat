const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFileUpload } = require('../middlewares');
const { 
    uploadFiles,
    updateImage,
    showImg,
    updateImageCloudinary
    } = require('../controllers/uploads.controller');
const { permittedCollection } = require('../helpers');



const router = Router();



router.post('/', validateFileUpload, uploadFiles);



router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'The Id have that be of Mongo').isMongoId(),
    check('collection').custom( c => permittedCollection( c, ['users', 'products'])),
    validateFields
], updateImageCloudinary);
//], updateImage);



router.get('/:collection/:id', [
    check('id', 'The Id have that be of Mongo').isMongoId(),
    check('collection').custom( c => permittedCollection( c, ['users', 'products'])),
    validateFields
], showImg);





module.exports = router;