import { AppError } from "./appError.js"

/**
 * Wraps an asynchronous function to catch errors and pass them to the next middleware.
 * @param {Function} fn - The asynchronous function to wrap.
 * @returns {Function} A new function that handles errors.
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            next(new AppError(err.message, err.statuscode));
            return res.json(err)
        });
    };
}
export const globalErrorHandling =(err,req,res,next)=>{
    // if(req.errArr){
    //     return res.status(err.statuscode||500).json({message:req.errArr,stack:err.stack,success:false})
    // }
    return res.status(err.statuscode||500).json({message:req.errArr,stack:err.stack,success:false})

}