const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });
  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token inválido", token: process.env.JWT_SECRET });
  }
}

module.exports = { validateToken };