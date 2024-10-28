const isRoleValid = (req, res, next) => {
    const currentRol = req.body.currentRol; // Usuario logueado
    const rol = req.body.rol; // Rol que se está intentando asignar

    // Verifica que se obtuvo el usuario logueado
    if (!currentRol === null) {
        return res.status(401).json({ message: 'No se obtuvo el usuario logueado' });
    }

    // Condiciones para el rol "super"
    if (currentRol === 0) {
        if (rol !== 2 && rol !== 1) {
            return res.status(403).json({ message: 'El rol proporcionado no es válido para el usuario super' });
        }
    } 
    // Condiciones para el rol "admin"
    else if (currentRol === 1) {
        if (rol !== 2) {
            return res.status(403).json({ message: 'El rol proporcionado no es válido para el usuario admin' });
        }
    } 
    // Condiciones para el rol "comun"
    else if (currentRol === 2) {
        return res.status(403).json({ message: 'Los usuarios comunes no pueden crear otros usuarios' });
    }

    // Si pasa todas las validaciones, continúa
    next();
};

module.exports = isRoleValid;
