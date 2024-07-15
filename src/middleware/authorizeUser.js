export const authorizeUser = (req, res, next) => {
    if (req.user.role !== "User") {
      return res.status(403).json({ error: "You are not authorized to perform this action." });
    }
    next();
  };
  