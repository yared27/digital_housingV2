
export const isAuthenticated  = (req, res, next) => {
    // Your authentication logic here
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded._id, role: decoded.role };

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();

};  