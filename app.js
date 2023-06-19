//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const ejs = require("ejs");


const app = express();

app.use(express.static("public"));
app.set("view enginge", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

console.log("process env: ", process.env);

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get('/', function (req, res) {
    res.render("home.ejs");
});

app.get('/login', function (req, res) {
    res.render("login.ejs");
});

app.get('/register', function (req, res) {
    res.render("register.ejs");
});

app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
    .then(() => {
        res.render("secrets.ejs");
    }).catch((err) => {
        res.render(err);
    });
});

app.post('/login', function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({
        email: userName
    }).then((foundOne) => {
        if (foundOne.password === password){
            console.log(foundOne.password);
            res.render("secrets.ejs");
        } else {
            res.render("home.ejs");
        }
    }).catch ((err) => {
        res.render(err);
    })
})


app.listen("3000", function () {
    console.log("server started on port 3000");
});
