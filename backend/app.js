const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors');


const userRoutes = require('./api/routes/user');


mongoose.connect('mongodb://bebev1:8DK0HIy6bv88vuDV@bebev1-shard-00-00-ciok6.mongodb.net:27017,bebev1-shard-00-01-ciok6.mongodb.net:27017,bebev1-shard-00-02-ciok6.mongodb.net:27017/test?ssl=true&replicaSet=bebev1-shard-0&authSource=admin&retryWrites=true&w=majority'
);
//mongoose.connect('mongodb+srv://bebev1:8DK0HIy6bv88vuDV@bebev1-ciok6.mongodb.net/test?retryWrites=true&w=majority', {
//useNewUrlParser: true
//});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("h");

});

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({ origin: 'http://localhost:4200' }));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


app.use("/user", userRoutes);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;
