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
            { id: user.id }, 
            config.secret, 
            { expiresIn: 86400 } // 24 hours
        );

        res.status(200).send({
            status: "success",
            data: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                accessToken: token
            }
          });
    });
};