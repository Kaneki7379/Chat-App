const jwt = require('jsonwebtoken');                  // 1
require('dotenv').config();                           // 2

module.exports = (req, res, next) => {                // 3
  const token = req.headers.authorization?.split(' ')[1]; // 4
  if (!token) return res.status(401).json({ message: 'No token' }); // 5
  try {                                                // 6
    const payload = jwt.verify(token, process.env.JWT_SECRET); // 7
    req.user = { username: payload.username };          // 8
    next();                                            // 9
  } catch (err) {                                      // 10
    return res.status(401).json({ message: 'Invalid token' }); // 11
  }                                                   // 12
};                                                    // 13
