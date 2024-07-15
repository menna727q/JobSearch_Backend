import { Schema, model } from "mongoose";

const appSchema=new Schema({
jobId:{type:Schema.Types.ObjectId,
    ref:"Job"},
applierId:{type:Schema.Types.ObjectId,ref:"User"},
appliertechnicalSkills: {
    type: [String],
    required: true
  },
  appliersoftSkills: {
    type: [String],
    required: true
  },
  userResume:{type:String,required:true}

})

export const Application=model("Application",appSchema)