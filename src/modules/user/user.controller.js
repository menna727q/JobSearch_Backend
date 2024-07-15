import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { User } from "../../../db/models/user.model.js";
import bcrypt, { hashSync } from "bcrypt"
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/appError.js';
export const userSignUp=asyncHandler(
  async(req,res,next)=>{

    const {firstName,LastName,email,password,recoveryEmail,DOB,mobileNum,role}= req.body;
   const userExistance=await User.findOne({email});
   if(userExistance){
      //  throw new('user already exist',{cause:409})
      next(new AppError('user already exist',409))
    } 
    const hashpassword=bcrypt.hashSync(password,8)
    const user=new User({
        userName: { firstName, LastName },
        email,
        password:hashpassword,
        recoveryEmail,
        DOB,
        mobileNum,
        role
    })
    const createUser= await user.save()
    return res.status(201).json({message:"User created successfully",success:true,data:createUser})
  }
)

export const userSignin=asyncHandler(
  async(req,res,next)=>{
    const { identifier, password } = req.body;
    // Find the user by email, recoveryEmail, or mobileNumber
    const user = await User.findOne({
      $or: [
        {mobileNum:identifier},
        { email: identifier },
        { recoveryEmail: identifier }
       
      ]
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    // Validate password
    const isPasswordValid =  bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      // return res.status(400).json({ error: 'Invalid password' });
      return next( new AppError('Invalid password', 400))
    }

    // Update status to 'online'
    user.status = 'online';
    await user.save();
  const accessToken=jwt.sign({userID:user._id,userRole:user.role},'hj4bh34h4')
    res.status(200).json({ message: 'Sign in successful', user ,accessToken});
  
}
)
export const userUpdate = asyncHandler(
  async (req, res) => {
   
    const { email, mobileNum, recoveryEmail, DOB, lastName, firstName } = req.body;
    const userId = req.user._id; // Extracted from the token in the authentication middleware

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the new email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Check if the new mobile number already exists
    if (mobileNum && mobileNum !== user.mobileNum) {
      const existingUser = await User.findOne({ mobileNum });
      if (existingUser) {
        return res.status(400).json({ error: 'Mobile number already in use' });
      }
    }

    // Update user details
    if (email) user.email = email;
    if (mobileNum) user.mobileNum = mobileNum;
    if (recoveryEmail) user.recoveryEmail = recoveryEmail;
    if (DOB) user.DOB = DOB;
    if (lastName) user.userName.LastName = lastName;
    if (firstName) user.userName.firstName = firstName;

    await user.save();

    res.status(200).json({ message: 'Account updated successfully', user });
  } 
)
export const deleteuser = asyncHandler(
  async(req,res)=>{
   
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, 'hj4bh34h4');

    // Find the user by ID
    const user = await User.findById(payload.userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await user.deleteOne();

    res.status(200).json({ message: 'Account deleted successfully' });
  
}
)
export const getuserData = asyncHandler(
  async(req,res)=>{
    
    const token=req.headers.authorization.split(' ')[1];
    const payload=jwt.verify(token,'hj4bh34h4')
    const getuser= await User.findById(payload.userID)
    if(!getuser){
        return res.status(404).json({ error: 'User not found' });   
    }
   return res.status(200).json({message:"User data ",getuser})
  }
)
   
export const getprofiledata= asyncHandler(
  async(req,res)=>{
    const {id}=req.params
    const user= await User.findById(id)
    if(!user){
        return res.status(404).json({ error: 'User not found' });   
    }
    const userprofile={
        userName: user.userName,
        email: user.email,
        recoveryEmail: user.recoveryEmail,
       DOB: user.DOB,
       mobileNum: user.mobileNum,
       role: user.role,
       status: user.status
    };
    return res.status(200).json({message:"User profile Data",userprofile})

}
)
export const updatepassword = asyncHandler(
  async(req,res)=>{
   
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    const payload = jwt.verify(token, 'hj4bh34h4');
    console.log('Token payload:', payload);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Find the user by ID
    const user = await User.findById(payload.userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate the current password
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    console.log('New hashed password:', hashedPassword);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  }
)
      
export const getByRecovery = asyncHandler(
  async (req, res) => {
    const { recoveryEmail } = req.body;
    const users = await User.find({ recoveryEmail: recoveryEmail });

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found with the provided recovery email' });
    }

    const usersData = users.map((user) => {
      return {
        userName: user.userName,
        email: user.email,
        recoveryEmail: user.recoveryEmail
      };
    });

    return res.status(200).json({ message: "User profile Data", usersData });
  
}
)
// function generateRandomPassword(length) {
//     const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|;:,.<>?";
//     let password = "";
//     const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // Pattern for password validation
  
//     do {
//       password = "";
//       for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * charset.length);
//         password += charset[randomIndex];
//       }
//     } while (!pattern.test(password)); // Regenerate password until it meets the pattern
  
//     return password;
// }

// export const forgetPassword =  async(req,res,next)=>{
//     try {
//         const randomPassword = generateRandomPassword(12);
//         if(!req.body.email)
//         {
//             res.status(409);
//             return next(new Error('Email is Required' , {cause:409}))
//         }
//         const {email}= req.body;
//         const checkUser =  await User.findOne({email})
//         if(!checkUser){
//             res.status(409);

//             return next(new Error('Email not Exist' , {cause:409}))
//         }
//         else{
//             const hashPassword = hashSync({
//                 plainText :randomPassword
//             })
//             await User.findOneAndUpdate({email},{password : hashPassword})
    
//             await sendEmail({to : email ,  subject: "Reset password ✔",text: `Password is Sent`,html: `<b>Your new password is: ${randomPassword}</b>`})
//             return res.status(200).json({message: 'Password sent successfully'})
//         }
//         }
//     catch (error) {
//         res.status(400);
//         return next(new Error( error, {cause:400}))
//     }
// }