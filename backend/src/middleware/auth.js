const jwt = require('jsonwebtoken');
const db = require('../models/index');

// Middleware xác thực người dùng
const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization'];
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware phân quyền cho admin
const authorizeAdmin = async (req, res, next) => {
    try {
      const user = await db.User.findOne({ 
        where: { email: req.user.email } 
        });
      if (user && user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Admin access required' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  

module.exports = { 
    authenticateToken, authorizeAdmin 
};
