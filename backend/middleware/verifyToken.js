const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "Token requis" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Token invalide" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
}

module.exports = verifyToken;
