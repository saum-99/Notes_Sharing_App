const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
 
  const token = req.cookies.access_token;
  

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  //try {
    //console.log(config.TOKEN_KEY);
    
    const decoded = jwt.verify(token, config.TOKEN_KEY); //config.TOKEN_KEY
    req.isLoggedIn = decoded;
    console.log(req.isLoggedIn);
    
  /*} catch (err) {
      return res.send(err);
  }
  */
 
  return next();
};

module.exports = verifyToken;