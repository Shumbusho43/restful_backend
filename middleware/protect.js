//protect middleware
const jwt = require("jsonwebtoken");
const db = require("../models/db");
exports.protect = async (req, res, next) => {
    try {
        //get token from header
        const token = req.headers.authorization || req.cookies.token;
        //check if token exists
        if (!token)
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Access denied, no token provided",
            });
        if (!token.startsWith("Bearer "))
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Access Denied",
            });
        //verify token
        const tokenString = token.split(" ")[1];
        try {
            const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
            //check if user exists
            const user = await db.query("SELECT * FROM users WHERE id = $1", [
                decoded.userId,
            ]);
            if (user.rows.length === 0)
                return res.status(404).json({
                    success: false,
                    status: 404,
                    message: "User not found",
                });
            //set user in request object
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            // Handle the specific error when the token is invalid
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Invalid token",
                });
            }
            // Handle other errors
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

//Role middleware
exports.role = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // return res.status(401).send('Access Denied - You are not authorized to access this route');
            return res.status(401).json({
                success: false,
                status: 401,
                message: 'Access Denied - You are not authorized to access this route'
            });
        }
        next();
    }
}