import multer, { diskStorage } from "multer";

export const upload = function ({folder, filter}) {
    const storage = diskStorage ({
        destination: `upload${folder}`,
        filename: function (req, file, cb){
            console.log(file)
            cb(null, nanoid()+ "__" + file.originalname)
        }
    })
    const fileFilter = function (req, file, cb){
        if(!filter.includes(file.mintype)){
            return cb(new Error("invalid file format"), false)
        }
        return cb(null, true)
    }
    const multerUpload = multer ({storage, fileFilter})
    return multerUpload
}