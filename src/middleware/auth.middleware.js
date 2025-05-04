import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    console.log('Decoded User:', req.user); 
    next();
  });
};