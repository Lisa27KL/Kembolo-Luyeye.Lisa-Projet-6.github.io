const Sauce = require('../models/Sauces.js');
const fs = require('fs');


// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [''],
      usersDisliked: ['']
    });
    sauce.save()
    .then(()=> res.status(201).json({message: 'Sauce Saved !'}))
    .catch(error=> res.status(400).json({error}));

    console.log(sauce)
};
  

// Modification d'une sauce
exports.modifySauce = (req, res, next) =>{
    const sauceObject = req. file?
    { 
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    } : {...req.body};

    Sauce.updateOne({_id:req.params.id}, {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({message: 'Sauce Modified !'}))
    .catch(error => res.status(400).json({error}));
};


// Suppression d'une sauce
exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
    .then((sauce)=> {
        
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () =>{
        Sauce.deleteOne({_id:req.params.id})
        .then(()=> res.status(200).json({message: 'Sauce Deleted !'}))
        .catch(error => res.status(400).json({error}));
    });
    
    })
    .catch(error => res.status(500).json({error}));
    
};

// Affichage d'une sauce
exports.getOneSauce =(req, res, next)=>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};


// Affichage des sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};


exports.likeDislikeSauce = (req, res, next) => {
     
    if(req.body.like === 1){
        console.log(req.body.like); 

        Sauce.updateOne(
            {_id: req.params.id},
            {
                $inc:{likes: 1}, 
                $push: {usersLiked: req.body.userId}
            }
        )
        .then(() => res.status(201).json({message: "GREAT ! You like the sauce !"}))
        .catch(error => res.status(400).json({error}));

    }else if(req.body.like === -1){
        Sauce.updateOne(
            {_id: req.params.id},
            {
                $inc:{dislikes: 1}, 
                $push: {usersDisliked: req.body.userId}
            }
        )
        .then(() => res.status(201).json({message: "OH NO ! You don't like this sauce !"}))
        .catch(error => res.status(400).json({error}));

    }
    else{
            Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
    
            if(sauce.usersLiked.includes(req.body.userId) && req.body.like !== -1){
    
                Sauce.updateOne(
                    {_id: req.params.id},
                    {
                        $inc:{likes: -1}, 
                        $pull: {usersLiked: req.body.userId}
                    }
                )
                .then(() => res.status(201).json({message: "No more like !!"}))
                .catch(error => res.status(400).json({error}));
    
            }else if(sauce.usersDisliked.includes(req.body.userId) && req.body.like !== -1){
    
                Sauce.updateOne(
                    {_id: req.params.id},
                    {
                        $inc:{dislikes: -1}, 
                        $pull: {usersDisliked: req.body.userId}
                    }
                )
                .then(() => res.status(201).json({message: "No more dislike"}))
                .catch(error => res.status(400).json({error}));

            }
        })
        .catch(error => res.status(404).json({error}));

    }


};