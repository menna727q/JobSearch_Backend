// src/middlewares/auth.js
export const authorizeHRandUser = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'Company_HR' && role !== 'User') {
        return res.status(403).json({ error: 'You are not authorized to perform this action' });
    }
    next();
};
