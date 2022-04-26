const User = require("../models/User");
const jwt = require('jsonwebtoken');

//HANDLE ERRORS
const handleErrors = (err) => {
    // console.log(err.message, err.code)
    let errors = { email: '', password: '' };

    //INCORRECT EMAIL 
    if (err.message === 'incorrect email') {
        errors.email = 'This email is not registered'
    };

    //INCORRECT password 
    if (err.message === 'incorrect password') {
        errors.password = 'This password is incorrect'
    };

    // DUPLICATE EMAIL ERROR
    if (err.code === 11000) {
        errors.email = 'Email already in use';
        return errors;
    }

    // VALIDATION ERRORS
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message; // prop.path is either email or password error // = we assign the responding message 
        }) // it takes the value from err.errors which are the email and password errors informations
    }
    return errors;
};

const maxAge = 3 * 24 * 60 * 60;
// CREATE TOKEN
const createToken = (id) => {
    return jwt.sign({ id }, 'secret, create .env', {  // this creates the token using the id and secret and options
        expiresIn: maxAge // jwt take seconds length
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body; // we destructure the email and password from the req.body
    
    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); 
        res.status(200).json({ user: user._id });
    } 
    catch (err) {
        const errors = handleErrors(err); //this returns errors from the handle err function
        res.status(400).json({ errors });
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password); // this function comes from User.js and returns either user or error
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); 
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
};


module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })  // we are creating new jwt token with the same name and it replaces the old one
                                          // the new cookie has no value and expires in 1 milisecond
    res.redirect('/');
}