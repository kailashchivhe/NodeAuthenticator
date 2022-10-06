const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Item = db.item;
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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    newUser.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
        }
        else {
            res.status(200).send({ message: "User was registered successfully!" });
        }
    });
    // const braintreeUser = {"email":newUser.email, "firstName": newUser.firstName, "lastName": newUser.lastName, "id":newUser._id };
    // gateway.customer.create(braintreeUser).then(result => {
    //     if(result.success){
    //         newUser.save((err, user) => {
    //             if (err) {
    //                 res.status(500).send({ message: err });
    //             }
    //             else {
    //                 console.log(user);
    //                 res.status(200).send({ message: "User was registered successfully!" });
    //             }
    //         });
    //     }
    //     else{
    //         res.status(500).send({message: "User was not registered" });
    //     }
    //   }).catch(error=>{
    //     console.log(error);
    //   });
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
            { user },
            config.secret
        );

        res.status(200).send({
            token: token,
            id: user.id
        })
    });
};

exports.profile = (req, res) => {
    let id = req.query.userId;
    User.findById(id, function (err, docs) {
        if (err){
            console.log(err);
            res.status(404).send({
                id: null,
                message: "User not found."
            });
        }
        else{
            res.status(200).send({
                message: 'Success',
                data: docs
            })
        }
    });
};

exports.updateUser = (req, res) => {
    let user = {"firstName": req.body.firstName, "lastName": req.body.lastName};
    let id = req.body.id;

    User.findByIdAndUpdate(id, user, { useFindAndModify: false, runValidators: true })
    .then(user => {
        if (user) {
            res.status(200).send('success')
        } else {
            let err = new Error('Cannot find user with id ' + id);
            res.status(404).send(err);
        }
    })
    .catch(err => {
        res.status(400).send(err);
    });
}

exports.verifyToken = (req, res, next) => {
    let token = req.query.token;

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
};

exports.getItems = (req, res) => {
    Item.find({}, (err, items) => {
        if (err) throw err;
        console.log(items);
        return res.status(200).send({ items: items });  
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