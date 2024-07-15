import multer,{diskStorage} from "multer";
import { nanoid } from "nanoid";
export const fileUpload=()=>{
    const storage= diskStorage({
        destination:"uploads"
        ,filename:(req,filename,cb)=>{
             cb(null,nanoid()+filename.originalname)
        }})
 const upload =  multer({storage})
  return upload
}