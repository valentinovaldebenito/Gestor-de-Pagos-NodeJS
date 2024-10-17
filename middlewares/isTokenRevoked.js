function isTokenRevoked(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (revokedTokens.includes(token)) {
    console.log('Token revoked')
    return res.status(401).json({ message: "Token revocado. Debes iniciar sesión nuevamente." });
  }

  next();
}
