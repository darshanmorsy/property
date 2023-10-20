const multer = require('multer');
const AVTAR_PATH = '/images'
const path = require('path');

const storage = multer.diskStorage({

    destination: (req, file, cd) => {
        cd(null, path.join(__dirname, '..', AVTAR_PATH));
    },
    filename: (req, file, cd) => {
        var fileextension = path.extname(file.originalname);
        cd(null, file.fieldname + '-' + Date.now() + Math.random() * 8 * 6 + Date.now() + Math.random() * 8 * 6 + fileextension)
    }

})
                            
const upload = multer({
    storage
})

module.exports = upload
