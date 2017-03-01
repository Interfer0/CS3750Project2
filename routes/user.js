module.exports = function(User) {

    var express = require('express');
    var router = express.Router();

    let loggedin = false;

    router.all('/*', function(request, response, next) {
        if (request.session.myName != null && request.session.myName != undefined) {
            loggedin = true;
        } else {
            loggedin = false;
        }
        next();
    })

    router.get("/Users/Login", function(request, response, next) {
        response.render("login.jade", { loggedIn: loggedin });
    });

    router.get("/Users/Register", function(request, response, next) {
        response.render("register.jade", { loggedIn: loggedin });
    });

    router.post("/Users/Register/NewUser", function(request, response, next) {
        let exists = false;
        doesUserExist(request.body.name, function(err, user) {
            if (user) {
                response.status(409).json({ message: "Username Taken" }); //Changed these out to status codes

            } else {
                var anewone = new User;
                anewone.name = request.body.name;
                anewone.normalized = request.body.name.toLowerCase();
                anewone.firstname = request.body.firstname;
                anewone.lastname = request.body.lastname;
                anewone.password = request.body.password;
                anewone.email = request.body.email;
                //console.log(anewone);
                anewone.save();
                response.status(201).json({ message: "User Created" });
            }
        });
        if (!exists) {

        }
    });


    router.post("/Users/login", function(request, response) {
        var username = request.body.username;
        var password = request.body.password;

        //console.log("in the login post func %S %S", username, password);
        authenticate(request.body.username, request.body.password, function(err, user) {
            if (user) {
                request.session.myName = user.name;
                response.status(200).json({ message: "Message received" }); //Changed these out to status codes
            } else {
                //console.log('in the else');
                response.status(301).json({ message: "Invalid Login Details Supplied" });
            }
        })
    });

    router.post("/Users/logout", function(request, response) {
        request.session.myName = null;
        response.status(200).json({ message: "Message received" }); //Changed these out to status codes

    });


    function authenticate(name, pass, fn) {
        if (!module.parent) console.log('auth');

        User.findOne({
                normalized: name.toLowerCase()
            },
            //this right here is where it needs (user), but I'm not understanding how that can be "true" and run the pass==user.password
            function(err, user) {
                if (user) {
                    if (err) return fn(new Error('cannot find user'));
                    if (pass == user.password) {
                        return fn(null, user);
                    }
                    //need code here in an else statement
                } else {
                    //console.log("here1?")
                    return fn(new Error('cannot find user'));
                }
            });
    }

    function doesUserExist(name, fn) {
        User.findOne({
                normalized: name.toLowerCase()
            },
            function(err, user) {
                if (user) {
                    return fn(null, user)
                } else {

                    return fn(new Error('gtg'));
                }
            });
    }


    return router;
}