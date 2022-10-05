const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const braintree = require("braintree");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "64jmbtt6hp89zxz2",
  publicKey: "469wp5pwhq2s4st3",
  privateKey: "e1a475d96520b7f033209db7853da770"
});

exports.signup = (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    });

    braintree.createCustomer(newUser).then(result => {
        if(result.success){
            newUser.save((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                }
                else {
                    console.log(user);
                    res.status(200).send({ message: "User was registered successfully!" });
                }
            });
        }
        else{
            res.status(500).send({message: "User was not registered" });
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

exports.updateFirstName = (req, res) => {
    User.findOne({ email: req.params.email }, (err, user) => {
        let newData = {$set: { first_name: req.body.first_name }};
        if(err) {
            return res.status(500).send(err);
        }
        User.updateOne({ email: user.email }, newData, (err, user) => {
            if (err) {
                console.log("Unable to update data in your collection")
            } else {
                console.log(user)
                res.status(200).send({ message: "User first name successfully updated!" });
            }  
        });
    })
}

exports.updateLastName = (req, res) => {
    User.findOne({ email: req.params.email }, (err, user) => {
        let newData = {$set: { last_name: req.body.last_name }};
        if(err) {
            return res.status(500).send(err);
        }
        User.updateOne({ email: user.email }, newData, (err, user) => {
            if (err) {
                console.log("Unable to update data in your collection")
            } else {
                console.log(user)
                res.status(200).send({ message: "User last name successfully updated!" })
            }
        });
    })
}

/*
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
*/

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });  
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized!" });
        }
        req.email = decoded.email;
        next();
      });

    /*
    let token = req.header("x-access-token");
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
    */
};

//braintree
function createCustomer(user){
    return gateway.customer.create({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        id: user.email
      });
}

function getToken(email){
    gateway.clientToken.generate({
        customerId: email
      }).then(response => {
        // pass clientToken to your front-end
        const clientToken = response.clientToken
      });
}

function checkout(){
    app.post("/checkout", (req, res) => {
        const nonceFromTheClient = req.body.payment_method_nonce;
        // Use payment method nonce here
      });
}

function createTransaction(){
    gateway.transaction.sale({
        amount: "10.00",
        paymentMethodNonce: nonceFromTheClient,
        deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      }).then(result => { });
}