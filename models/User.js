const mongoose = require('mongoose');
const { isEmail } = require('validator'); // destructures the isEmail fc from validator and assigns it to isEmail
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        validate: [isEmail, 'Please enter a valid email'],
        lowercase: true // this will turn it to lowercase before we store it
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: [6, 'Minimum password length is 6 characters.']
    }
});

// MONGOOSE HOOK
// * always call next() when using mongoose hooks or middleware *
// FIRE A FUNCTION AFTER DOC IS SAVED TO DB
// doc is the user object
userSchema.post('save', function (doc, next) { // this is not http post // its mean post save as of after saving, fire function
    console.log('new user was created', doc)
    next();
});

// FIRE A FUNCTION before DOC IS SAVED TO DB
userSchema.pre('save', async function (next) { // with this function  synthax we can use this.
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)// this is the password of the user that we are going to creata a.k.a. the password that the user just typed in

    next();
});

//STATIC METHOD TO LOGIN USER
userSchema.statics.login = async function (email, password) { // schema.statics and then we call the method however we want aka login
    const user = await this.findOne({ email }) // if this finds a user based on email it will assign it to const user
                                                // otherwise const user will be undefined
    if (user) {
        const auth = await bcrypt.compare(password, user.password) // just password is the plaintext pass, and user.password is the hashed password
    
        if (auth) {
            return user;
        }
        throw Error('incorrect password')
    } 
    throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema);

module.exports = User;