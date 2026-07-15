const jwt = require('jsonwebtoken');

// Middleware para verificar que el usuario está logueado
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado. Inicie sesión.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guarda los datos decodificados (id, email, role) en el objeto request
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

// Middleware para restringir endpoints solo a Administradores (Superusuario)
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Permiso denegado. Se requiere rol de Administrador.' });
    }
};