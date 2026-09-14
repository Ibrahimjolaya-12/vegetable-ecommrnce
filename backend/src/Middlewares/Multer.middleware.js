import multer from "multer";
import path from "path";
const storage = multer.diskStorage(
    {
        destination: function (req, file, cb ){
            cb(null, "./public/temp")
        },
        filename: function (req, file, cb){
            const suffix = Date.now() + "-" + Math.random().toString(36).slice(2)
            cb(null, file.fieldname + "-" + suffix+path.extname(file.originalname))
        }
    }
)

const upload = multer({storage});

export default upload;