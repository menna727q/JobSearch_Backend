import { Schema, model } from "mongoose";

const companySchema=new Schema({
companyName:{type:String,required:true,uniquie:true},
description:{type:String},
industry:{type:String},
address:{type:String},
numberOfEmployees: {
    type: String,
    validate: {
      validator: function(value) {
        // Validate the range using a regular expression
        const regex = /^\d{2}-\d{2} employees$/;
        return regex.test(value);
      },
      message: 'Invalid number of employees. Please use the format XX-XX employees.'
    },
    required: true
  },
 companyEmail:{type:String,required:true,uniquie:true},
 companyHR:{
    type:Schema.Types.ObjectId,
    ref:"User"
 }


})

export const Company=model("Company",companySchema)