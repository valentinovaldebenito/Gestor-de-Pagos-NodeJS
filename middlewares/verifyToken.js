const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    // Verifica si el token está presente
    if (!token) {
        return res.status(401).json({ message: 'No se obtuvo el token' });
    }

    // Si el token empieza con 'Bearer ', extrae el token sin el prefijo
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    // Verifica el token
    jwt.verify(token, 'tu_secreto', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Error al autenticar el token' });
        }

        // Agrega el userId al request para usarlo en las rutas protegidas
        req.userId = decoded.userId;
        next(); // Llama al siguiente middleware o controlador
    });
};

module.exports = verifyToken;
