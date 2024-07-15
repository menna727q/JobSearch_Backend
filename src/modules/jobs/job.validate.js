import joi from 'joi'

export const jobval=joi.object({
    jobTitle: joi.string().required(),
    jobLocation:joi.string().required().valid("onsite","remotly","hybrid"),
    workingTime:joi.string().required().valid('part-time','full-time'),
    seniorityLevel:joi.string().valid('Junior','Mid-Level','Senior','Team-Lead','CTO').required()
    ,jobDescription:joi.string(),
    technicalSkills :joi.string(),
    softSkills:joi.string(),
}).required()

