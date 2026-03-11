const { User } = require('../models/User');

let auth = async (req, res, next) => {
  // Safely check if cookies exist before reading w_auth
  let token = req.cookies ? req.cookies.w_auth : null;

  if (!token) {
      return res.json({ isAuth: false, error: true, message: "No token provided" });
  }

  try {
      // Await the new Promise-based findByToken method
      const user = await User.findByToken(token);
      
      if (!user) {
          return res.json({ isAuth: false, error: true });
      }

      req.token = token;
      req.user = user;
      next();
  } catch (err) {
      // Catches JWT verification errors or database errors
      return res.json({ isAuth: false, error: true, err });
  }
};

module.exports = { auth };
