import {Router} from 'express'
import * as cC from '../company/company.controller.js'
import { authenticateUser } from '../../middleware/authuser.js'
import { authorizeCompanyHR } from '../../middleware/companyauth.js'
import { authorizeHRandUser } from '../../middleware/authHRandUser.js'
import { validate } from '../../middleware/validation.js'
import { companyval } from './company.validate.js'
const companyrouter=Router()

//add company
companyrouter.post('/addcompany',authenticateUser,authorizeCompanyHR,validate(companyval),cC.addcompany)

//update company
companyrouter.put('/updatecompany/:companyId',authenticateUser,authorizeCompanyHR,cC.companyupdate)

//delete company
companyrouter.delete('/deletecompany/:companyId',authenticateUser,authorizeCompanyHR,cC.deletecompany)

//Get company data 
companyrouter.get('/getcompany/:companyId',authenticateUser,authorizeCompanyHR,cC.getdata)

//Search for a company with a nam
companyrouter.get('/search', authenticateUser, authorizeHRandUser, cC.searchCompany);

companyrouter.get('/:jobId', authenticateUser, authorizeCompanyHR, cC.getApplicationsForJob);

export {companyrouter}