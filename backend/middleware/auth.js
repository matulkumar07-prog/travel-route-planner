const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove "Bearer " from token
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
