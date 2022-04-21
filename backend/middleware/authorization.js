const jwt = require('jsonwebtoken');
const Sauce = require('../models/Sauces');

module.exports = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})

    .then((sauce)=>{
        console.log(sauce)
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,porcess.env.TOK_SECRET);
        const userId = decodedToken.userId;
        console.log(userId)
        req.authorization = {userId};

        if(sauce.userId !== userId){
            return res.status(401).json({error: "Unauthorized request !!"});
        
        }else{
            next();
        }
    })
    .catch (error => res.status(401).json({error: 'Unauthenticated Request !'}));

};