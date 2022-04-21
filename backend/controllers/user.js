const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/Users');

const emailValidator = require("email-validator");
const passwordValidator = require('password-validator');

// Create a strong password
const passwordValidatorSchema = new passwordValidator()

passwordValidatorSchema
.is().min(5)                                                                // Minimum length 8
.is().max(100)                                                              // Maximum length 100
.has().uppercase()                                                          // Must have uppercase letters
.has().lowercase()                                                          // Must have lowercase letters
.has().digits(2)                                                            // Must have at least 2 digits
.has().not().spaces()                                                       // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'Azerty123','123Azerty']);    // Blacklist these values


// Vérify the quality of the password and the sign up 
exports.signup = (req, res, next) => {

    if(!emailValidator.validate(req.body.email) || !passwordValidatorSchema.validate(req.body.password)){
        return res.status(400).json({error:"Email or Password must be verified" });
    
    } else if (emailValidator.validate(req.body.email) || passwordValidatorSchema.validate(req.body.password)){
        
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User ({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(()=> res.status(201).json({ message: 'New user created!'}))
                    .catch(error => res.status(400).json({error}));
            })
            .catch( error => res.status(500).json({error}));
    };
};


// Login
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
        .then(user =>{
            if(!user){
                return res.status(401).json({error:'User not found !'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(405).json({error:'Incorrect password !'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            (process.env.TOK_SECRET),
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch((error) => res.status(500).json({error}));
        })
        .catch((error )=>  res.status(500).json({error}));
};
