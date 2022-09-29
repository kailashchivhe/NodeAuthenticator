const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    });

    newUser.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
        }
        else {
            console.log(user);
            res.status(200).send({ message: "User was registered successfully!" });
        }
    });
};

exports.login = (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            return res.status(404).send({
                id: null,
                message: "User not found."
            });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password."
            });
        }
        
        let token = jwt.sign(
            //{ id: user.id }, 
            { user },
            config.secret, 
            { expiresIn: 86400 } // 24 hours
        );

        res.status(200).send({
            token: token
        })
    });
};

exports.profile = (req, res) => {
    let decodedToken = req.decodedToken;

    res.status(200).send({
        message: 'Successful log in',
        data: {
            decoded: decodedToken
        }
    });
};

exports.checkDuplicateEmail = (req, res, next) => {
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
exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-jwt-token"];
    if (token) {
        try {
            let decoded = jwt.verify(token, config.secret);
            req.decodedToken = decoded;
            next();


            res.status(200).send({
                status: "success",
                data: {
                    user: user
                },
            });
        
        } catch (err) {
            return res.status(401).send({ message: "Invalid token provided!", fullError: err });  
        }
    } else {
        res.status(401).send({ error: "Token is required!" })
    }
};