import { Router } from "express";
import * as uc from "../user/user.controller.js"
import { authenticateUser } from "../../middleware/authuser.js";
import { validate } from "../../middleware/validation.js";
import { signInval, signupval } from "./auth.validate.js";
const userRouter=Router()

userRouter.post('/signup',validate(signupval),uc.userSignUp)
userRouter.post('/signin',validate(signInval),uc.userSignin)
userRouter.put('/update',authenticateUser,uc.userUpdate)
userRouter.delete('/delete',uc.deleteuser)
userRouter.get("/getuserdata",uc.getuserData)
userRouter.get("/:id",uc.getprofiledata)
userRouter.put('/updatepassword',uc.updatepassword)
userRouter.get("/",uc.getByRecovery)

// userRouter.post("/forgetpassword",uc.forgetPassword);
export {userRouter}
