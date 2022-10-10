
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "64jmbtt6hp89zxz2",
    publicKey: "469wp5pwhq2s4st3",
    privateKey: "e1a475d96520b7f033209db7853da770"
});

exports.createCustomer = (newUser, res)=>{
    gateway.customer.create({firstName: newUser.firstName, lastName: newUser.lastName, email:newUser.email}).then(result => {
        if(result.success){
            newUser.customerId = result.customer.id;
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
            const customerErrors = result.errors.for("customer").deepErrors();
            for (const i in customerErrors) {
                if (customerErrors.hasOwnProperty(i)) {
                    console.log(customerErrors[i].code);
                    console.log(customerErrors[i].message);
                    console.log(customerErrors[i].attribute);
                }
            }
            res.status(500).send({message: "User was not registered" });
        }
      }).catch(error=>{
        console.log(error);
      });
}

exports.getToken = (id, res) => {
    gateway.clientToken.generate({
        customerId: id
      }).then(response => {
        if(response.success){
            const clientToken = response.clientToken
            res.status(200).send({
                message: 'Success',
                token: clientToken
            });
        }
        else{
            res.status(404).send({
                token: null,
                message: "Customer not found"
            });
        }
      });
}

exports.createTransaction= (amount, nonceFromTheClient, res)=>{
    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }).then(result => {
        if(result.success){
            res.status(200).send({
                message: 'Success'
            });
        }
        else{
            res.status(404).send({
                message: "Failed to create transaction"
            });
        }
    });
}