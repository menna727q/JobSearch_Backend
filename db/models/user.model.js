//schema
import { hashSync } from "bcrypt";
import { Schema,model } from "mongoose";

const userSchema= new Schema({
   userName:{
    firstName:{type:String,required:true},
    LastName:{type:String,required:true},
   },
   email:{type:String,required:true,uniquie:true},
   password:{type:String,required:true},
   recoveryEmail:{type:String},
   DOB: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Validate the date to be a valid Date object
        return !isNaN(Date.parse(value));
      },
      message: 'Invalid date format. Please use YYYY-MM-DD.',
    },
  },
  mobileNum:{type:String,uniquie:true},
  role: {
    type: String,
    enum: ['User', 'Company_HR'],
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    
  }
})


export const User= model("USer",userSchema)