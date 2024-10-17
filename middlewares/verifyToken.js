const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No se obtuvo el token' });
    }

    jwt.verify(token, 'tu_secreto', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Error al autenticar token' });
        }
        req.userId = decoded.userId;
        next();
    });
};

module.exports = verifyToken;