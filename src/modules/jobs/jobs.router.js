import {Router} from 'express'
import * as jc from '../jobs/jobs.controller.js'
import { authenticateUser } from '../../middleware/authuser.js'
import { authorizeCompanyHR } from '../../middleware/companyauth.js'
import { authorizeHRandUser } from '../../middleware/authHRandUser.js'
import { authorizeUser } from '../../middleware/authorizeUser.js'
import { fileUpload } from '../../utils/multer.js'
import { validate } from '../../middleware/validation.js'
import { jobval } from './job.validate.js'
const jobRouter=Router()


//add new job
jobRouter.post('/add', authenticateUser, authorizeCompanyHR,validate(jobval), jc.addJob);

//update job with id 
jobRouter.put('/update/:jobId', authenticateUser, authorizeCompanyHR, jc.updateJob);

//delete job
jobRouter.delete('/delete/:jobId', authenticateUser, authorizeCompanyHR, jc.deleteJob);

//get All Jobs With Company Info
jobRouter.get('/all', authenticateUser, authorizeHRandUser, jc.getAllJobsWithCompanyInfo);

//Get all Jobs for a specific company.
jobRouter.get('/company', authenticateUser, authorizeHRandUser, jc.getJobsForCompany);

// Get all Jobs that match the following filters allow user to filter with workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
jobRouter.get('/filter', authenticateUser, authorizeHRandUser, jc.getFilteredJobs);

//Apply to Job
jobRouter.post('/resume/:jobId',fileUpload().single('resume'),authenticateUser,jc.applyToJob)

export {jobRouter}