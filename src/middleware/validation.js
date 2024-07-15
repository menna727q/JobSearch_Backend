import { AppError } from "../utils/appError.js"

export const validate=(schema)=>{
    return (req,res,next)=>{
        let data={...req.body,...req.params,...req.query}
        const {error}=schema.validate(data,{abortEarly:false})
        if (error){
            // const errorArr = error.details.map((err)=>{
            //     // return err.message;
            //     req.errorArr=errorArr;
            //     return next(new AppError(errorArr,401))
            // })
            return res.json(error)
        }
        next()
    }
}