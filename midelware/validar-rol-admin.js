const jwt = require('jsonwebtoken');

const validateRoleAdmin = (req, res, next) => {
    if(req.payload.role != 'Administrador' ){
        return res.status(401).json({ mensaje : 'Error unauthorized' });
    }
    next();

}

module.exports = {
    validateRoleAdmin
}