const db = require("../models");
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
    //Check for duplicate username -- if found, signup error occurs
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Signup failed! Email is already in use!" });
            return;
        }

        next();
    })
};

const verifySignUp = { 
    checkDuplicateEmail
};

module.exports = verifySignUp;