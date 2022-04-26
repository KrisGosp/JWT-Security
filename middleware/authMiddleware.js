// COMMONLY USED AUTH MIDDLEWARE

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    // CHECK IF JWT EXISTS AND THEN IF ITS VALID
    if (token) {
        jwt.verify(token, 'secret, create .env', (err, decodedToken) => {// same secret as in authController
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else{
                console.log(decodedToken);
                next(); // if the authentication reaches this point then its passed and valid. Calling next exits the function and carries on with the code
            };
        });
    } else {
        res.redirect('/login');
    };
};

// CHECK CURRENT USER 
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'secret, create .env', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user; // we create user in res.locals and assign it value to user.findbyId 
                // we pass the user value to the view and it will check either its true or false // thats why set it equal to null up there
                next();
            };
        });
    } else {
        res.locals.user = null;
        next();
    };
};

module.exports = { requireAuth, checkUser };