import { Schema,model } from "mongoose";

const jobSchema=new Schema({
 jobTitle:{type:String},
 jobLocation:{type:String,
    enum:["onsite","remotly","hybrid"],
    required:true
 },
 workingTime:{type:String,enum:['part-time','full-time']},
 seniorityLevel:{type:String,enum:['Junior','Mid-Level','Senior','Team-Lead','CTO']},
 jobDescription:{type:String},
 technicalSkills: {
    type: [String],
    required: true
  },
  softSkills: {
    type: [String],
    required: true
  },
  addedBy:{type:Schema.Types.ObjectId,
    ref:'User'
  }
})
export const Job=model('Job',jobSchema)