

const validateFileUpload = (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: 'There is not files that to upload'
        });        
    }

    next();
}


module.exports = {
    validateFileUpload
}