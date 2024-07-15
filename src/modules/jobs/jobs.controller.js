import {Job} from '../../../db/models/job.model.js'
import { Company } from '../../../db/models/company.model.js';
import {Application} from '../../../db/models/application.model.js'
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/appError.js';

export const addJob = asyncHandler(
    async (req, res) => {
        const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
        const job = new Job({
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills,
            addedBy: req.user._id
        });
        await job.save();
        res.status(201).json({ message: 'Job added successfully', job });
   
}
)
export const updateJob = asyncHandler(
    async (req, res) => {
  
        const { jobId } = req.params;
        const updates = req.body;
        const job = await Job.findByIdAndUpdate(jobId, updates, { new: true });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job updated successfully', job });

}
)
export const deleteJob = asyncHandler(
    async (req, res) => {
   
        const { jobId } = req.params;
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
   
}
)

export const getAllJobsWithCompanyInfo = asyncHandler(async (req, res, next) => {
    const jobsWithCompanyInfo = await Job.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'addedBy',
          foreignField: 'companyHR',
          as: 'companyInfo'
        }
      },
      {
        $unwind: '$companyInfo'
      },
      {
        $group: {
          _id: '$companyInfo._id',
          companyName: { $first: '$companyInfo.companyName' },
          description: { $first: '$companyInfo.description' },
          industry: { $first: '$companyInfo.industry' },
          address: { $first: '$companyInfo.address' },
          jobs: {
            $push: {
              _id: '$_id',
              jobTitle: '$jobTitle',
              jobLocation: '$jobLocation',
              workingTime: '$workingTime',
              seniorityLevel: '$seniorityLevel',
              jobDescription: '$jobDescription',
              technicalSkills: '$technicalSkills',
              softSkills: '$softSkills'
            }
          }
        }
      }
    ]);
  
    res.status(200).json(jobsWithCompanyInfo);
  });

/**
 * Get jobs for a specific company
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const getJobsForCompany = asyncHandler(async (req, res, next) => {
    const { companyName } = req.query;
    const company = await Company.findOne({ companyName });
    if (!company) {
        return next(new AppError('Company not found', 404))
    }
    const jobs = await Job.find({
        addedBy: { $in: [company.companyHR, req.user._id] }
      });    res.status(200).json(jobs);
});
export const getFilteredJobs = asyncHandler(async (req, res) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    // Build the filter object dynamically based on the query parameters
    const filter = {};
    if (workingTime) filter.workingTime = workingTime;
    if (jobLocation) filter.jobLocation = jobLocation;
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
    if (jobTitle) filter.jobTitle = jobTitle;
    if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(',') };

    const jobs = await Job.find(filter);

    res.status(200).json({ jobs });
});
export const applyToJob = asyncHandler(
    async (req, res) => {
 
        const { jobId } = req.params;
        const { appliertechnicalSkills, appliersoftSkills } = req.body;
        const userId = req.user._id;
    
        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
        //   return res.status(404).json({ error: 'Job not found' });
        return next(new AppError('Job not found' ,404))
        }
        const userResume=req.file.path
        // Create a new application
        const application = new Application({
          jobId: jobId,
          applierId: userId,
          appliertechnicalSkills,
          appliersoftSkills,
          userResume
        });
    
        await application.save();
    
        res.status(201).json({ message: 'Application submitted successfully', application });
      
    }
)
export const uploadResume = async(req,res)=>{
    
    return res.json({success:true, file:req.file})
}