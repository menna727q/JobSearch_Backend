import joi from 'joi'

export const signupval=joi.object({
    firstName: joi.string().required(),
    LastName:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required()
    ,recoveryEmail:joi.string().email(),
    DOB :joi.date().required(),
    mobileNum:joi.string().length(14),
    role:joi.string().valid('User','Company_HR')
}).required()

export const signInval = joi.object({
    identifier: joi.alternatives().try(
      joi.string().email(),
      joi.string().length(14).pattern(/^\d+$/), // Assuming mobileNum is numeric
      joi.string().email() // Assuming recoveryEmail is also an email
    ).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required()
  }).required();