const path = require('path');

const { v4: uuidv4 } = require('uuid');


const uploadFile = ( files, validExtension = [ 'jpg', 'png', 'gif'], folder = '' ) => {

    return new Promise( (resolve, reject) => {
        
        const { file } = files;
        const cutName = file.name.split('.');
        const extension = cutName[ cutName.length - 1 ]
    
        // Validate the extension
        if ( !validExtension.includes( extension ) ) {
            reject(`The extension ${ extension } is not permitted - valid extensions: ${ validExtension }`)
        } 
    
        // Temporal name
        const tempName = uuidv4() + '.' + extension;
    
        const uploadPath = path.join(__dirname, '../uploads/', folder,tempName);
    
        file.mv(uploadPath, (err) => { 
        if (err) {
            reject(err);
        }
    
        resolve( tempName );
        });
    })

}


module.exports = {
    uploadFile
}