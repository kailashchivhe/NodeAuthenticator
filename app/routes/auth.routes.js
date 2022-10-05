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
    app.put("/updateFirstName/:email", controller.updateFirstName);
    app.put("/updateLastName/:email", controller.updateLastName);
};