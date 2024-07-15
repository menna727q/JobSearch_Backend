export const authorizeCompanyHR = (req, res, next) => {
    if (req.user.role !== "Company_HR") {
      return res.status(403).json({ error: "You are not authorized to perform this action." });
    }
    next();
  };
  