import joi from 'joi'

export const companyval=joi.object({
    companyName: joi.string().required(),
    description:joi.string().required(),
    industry:joi.string().required(),
    address:joi.string().required()
    ,numberOfEmployees:joi.string(),
    companyEmail :joi.string().email()
}).required()

