const jwt = require('jsonwebtoken');

async function isAuth(req, res, next) {
    try {
        let { authorization } = req.headers;
        if (!authorization)
            throw new Error('not authorized');

        authorization = authorization.split(' ');
        if (authorization[0] != 'Bearer' || authorization.length != 2)
            throw new Error('not authorized');
            
        const token = authorization[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded)
            throw new Error('not authorized');

        req.user = {
            id: decoded.id
        }
        next();
    } catch(error) {
        res.status(401).json(error.message);
    }
}

module.exports = isAuth;