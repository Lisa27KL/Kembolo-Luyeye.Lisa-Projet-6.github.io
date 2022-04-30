const Sauce = require('../models/Sauces.js');
const fs = require('fs'); //file system


// Create a sauce
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [''],
        usersDisliked: ['']
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce Saved !' }))
        .catch(error => res.status(400).json({ message: error }));
};


// Modify a sauce
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        // If image is modified -> delete the old one
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {

                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject })
                        .then(() => res.status(200).json({ message: 'Sauce modified !' }))
                        .catch(error => res.status(400).json({ message: error }));
                })
            })
            .catch(error => res.status(500).json({ message: error }));
    } else {
        // If the image is not modified
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject })
            .then(() => res.status(200).json({ message: 'Sauce modified !' }))
            .catch(error => res.status(400).json({ message: error }));
    }
};


// Delete a sauce
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ message: " Sauce not found" })
            };

            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ message: "Unauthorized request !!" })
            }

            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce Deleted !' }))
                    .catch(error => res.status(400).json({ message: error }));
            });

        })
        .catch(error => res.status(500).json({ message: error }));
};


// Display ONE sauce
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ message: error }));
};


// Display all sauces
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ message: error }));
};


// Like or Dislike a sauce
exports.likeDislikeSauce = (req, res) => {

    if (req.body.like === 1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId }
            }
        )
            .then(() => res.status(201).json({ message: "GREAT ! You like this sauce !" }))
            .catch(error => res.status(400).json({ message: error }));

    } else if (req.body.like === -1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId }
            }
        )
            .then(() => res.status(201).json({ message: "OH NO ! You don't like this sauce !" }))
            .catch(error => res.status(400).json({ message: error }));

    }
    else {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {

                if (sauce.usersLiked.includes(req.body.userId) && req.body.like !== -1) {

                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: "No more like !!" }))
                        .catch(error => res.status(400).json({ message: error }));

                } else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like !== -1) {

                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: "No more dislike" }))
                        .catch(error => res.status(400).json({ message: error }));
                }
            })
            .catch(error => res.status(404).json({ message: error }));
    }
};