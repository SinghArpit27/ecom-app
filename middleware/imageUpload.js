import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Attachments should be Image
const fileUpload = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname, '../public/uploads'));
    },

    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage: fileUpload });


export default upload;