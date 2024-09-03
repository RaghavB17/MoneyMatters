const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Token is valid");
        next();
      } catch (err) {
        console.error("Token verification failed:", err.message);
        res.json({ error: err.message });
      }
};

module.exports = authMiddleware;
