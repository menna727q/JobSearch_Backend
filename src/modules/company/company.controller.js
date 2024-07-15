import {Company} from'../../../db/models/company.model.js'
import {User} from '../../../db/models/user.model.js'
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Application } from '../../../db/models/application.model.js';
import { Job } from '../../../db/models/job.model.js';
import { AppError } from '../../utils/appError.js';
export const addcompany=asyncHandler(
  async(req,res,next)=>{
    
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    
    // Check if the company name or email already exists
    const existingCompany = await Company.findOne({ $or: [{ companyName }, { companyEmail }] });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company name or email already in use' });
    }

    // Create a new company
    const company = new Company({
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR: req.user._id
    });

    await company.save();
    res.status(201).json({ message: 'Company created successfully', company });
  
}
)

export const companyupdate = asyncHandler(
  async (req, res) => {
   
      const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
      const companyId = req.params.companyId; // Extracted from the request parameters
    
      // Find the company by ID
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
  
      // Check if the logged-in user is the owner of the company
      if (company.companyHR.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'You are not authorized to update this company' });
      }
  
      // Update company details
      if (companyEmail) company.companyEmail = companyEmail;
      if (companyName) company.companyName = companyName;
      if (description) company.description = description;
      if (industry) company.industry = industry;
      if (address) company.address = address;
      if (numberOfEmployees) company.numberOfEmployees = numberOfEmployees;
  
      await company.save();
  
      res.status(200).json({ message: 'Company updated successfully', company });
   
  }
)
  export const deletecompany = async(req,res)=>{
    
        const companyId = req.params.companyId; // Extracted from the request parameters
  
      // Find the company by ID
      const company = await Company.findById(companyId);
      if (!company) {
        console.log('Company not found');
        return res.status(404).json({ error: 'Company not found' });
      }
        // Delete user
        await company.deleteOne();
    
        res.status(200).json({ message: 'Account deleted successfully' });
      
}  
export const getdata =asyncHandler(
  async (req, res) => {
        const companyId = req.params.companyId;
        // Find the company by ID
        const companyData = await Company.findById(companyId);
        if (!companyData) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Check if the logged-in user is authorized to access this company's data
        if (companyData.companyHR.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to access this company data' });
        }

        // Find all jobs related to this company
        // const jobs = await Job.find({ addedBy: companyData.companyHR });

        res.status(200).json({ companyData });
   
}
)
export const searchCompany =asyncHandler(
  async (req, res) => {
   
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Company name is required for search' });
    }

    const companies = await Company.find({ companyName: { $regex: name, $options: 'i' } });
    if (companies.length === 0) {
        return res.status(404).json({ message: 'No companies found with the given name' });
    }

    res.status(200).json(companies);

}

)

export const getApplicationsForJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const companyId = req.params.companyId; // Extracted from the request parameters
    

  // Find the job and check if it exists
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new AppError('Job not found', 404));
  }
  // Find the company by ID
  const company = await Company.findById(companyId);
  // if (!company) {
  //   return res.status(404).json({ error: 'Company not found' });
  // }

  // Check if the logged-in user is the owner of the company
  if (company.companyHR.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'You are not authorized to get applications this company' });
  }
  // Find all applications for the job
  const applications = await Application.find({ jobId });

  // Fetch user data for each application
  const applicationsWithUserData = await Promise.all(applications.map(async (application) => {
    const applier = await User.findById(application.applierId);
    return {
      ...application.toObject(),
      applierData: {
        name: `${applier.userName.firstName} ${applier.userName.LastName}`,
        email: applier.email,
        mobileNum: applier.mobileNum
      }
    };
  }));

  res.status(200).json({ applications: applicationsWithUserData });
});
