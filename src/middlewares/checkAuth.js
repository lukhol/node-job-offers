const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret-key');
        req.userData = decoded;
        console.log('Current logged in user:', decoded);
    } catch(error) {
        return res.status(401).json({
            message: "Auth failed."
        });
    }

    next();
};