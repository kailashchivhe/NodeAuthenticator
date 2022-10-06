const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-jwt-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/auth/signup", controller.signup);
    app.post("/api/auth/login", controller.login);
    app.get("/api/auth/profile", controller.verifyToken, controller.profile);
    app.post("/api/auth/profile", controller.verifyToken, controller.updateUser);

    app.get("/api/auth/items", controller.verifyToken, controller.getItems);

    app.get("/api/auth/token", controller.verifyToken, controller.braintreeToken);

    app.post("/api/auth/transaction", controller.verifyToken, controller.transaction );
};