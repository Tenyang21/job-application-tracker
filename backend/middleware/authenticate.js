const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = user.id;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
}

module.exports = authenticate;
