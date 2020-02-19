const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const User = require("../models/user");


exports.users_get_all = (req, res, next) => {
    User.find()
        .select(" name email gender ")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        gender: doc.gender,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/user/" + doc._id
                        }
                    };
                })
            };
            //   if (docs.length >= 0) {
            res.status(200).json(response);
            //   } else {
            //       res.status(404).json({
            //           message: 'No entries found'
            //       });
            //   }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
module.exports.userProfile = (req, res, next) =>{

    //  res.send("tagId is set to " + req.params.tagId);
    User.findOne({ _id: req.params.userId },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user :{name:user.name , email: user.email, gender: user.gender} });
        }
    );
}

/* exports.userProfile = (req, res, next ) => {
    User.findOne({_id: req.params.userId})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                user: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        gender: doc.gender,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/user/" + doc._id
                        }
                    };
                })
            };
            //   if (docs.length >= 0) {
            res.status(200).json(response);
            //   } else {
            //       res.status(404).json({
            //           message: 'No entries found'
            //       });
            //   }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}; */
/*exports.userProfile = (req, res, next) => {
    User.findOne({_id: req._id},
        (err, user) => {
            if (!user)
                return res.status(404).json({status: false, message: 'User record not found.'});
            else
                return res.status(200).json({status: true, user: _.pick(user, ['name', 'email'])});
        }
    );
}; */



exports.user_signup = (req, res, next) => {
    console.log('1')
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            console.log('2', user)

            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                console.log('3', req)
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            gender: req.body.gender
                        });

                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.clear()
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        }, err => {
            console.log("EROR", err)
        });
}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        Math.random().toString(),
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token,
                        userId: user[0]._id
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.user_delete = (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};
