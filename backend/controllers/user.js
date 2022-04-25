const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/Users');

const emailValidator = require("email-validator");
const passwordValidator = require('../middleware/passwordValidator');

// Vérify the quality of the password and the sign up 
exports.signup = (req, res) => {

    if(!emailValidator.validate(req.body.email) || !passwordValidator.validate(req.body.password)){
        return res.status(400).json({message:"Email or Password must be verified" });
    
    } else if (emailValidator.validate(req.body.email) || passwordValidator.validate(req.body.password)){
        
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User ({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(()=> res.status(201).json({ message: 'New user created!'}))
                    .catch(error => res.status(400).json({message: error}));
            })
            .catch( error => res.status(500).json({message: error}));
    };
};


// Login
exports.login = (req, res) => {
    User.findOne({ email: req.body.email})
        .then(user =>{
            if(!user){
                return res.status(401).json({message:'User not found !'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(405).json({message:'Incorrect password !'})
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
                .catch((error) => res.status(500).json({message: error}));
        })
        .catch((error )=>  res.status(500).json({message: error}));
};
