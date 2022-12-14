const express = require('express');
const bodyParser = require('body-parser');
const route = require("./route/route");
const {default:mongoose} = require('mongoose');
const { Router } = require('express');
const router = require('./route/route');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb+srv://arnabbiswas_14:arnabbiswas@cluster0.b95gv.mongodb.net/Eternalight-DataBase?retryWrites=true&w=majority" , {
    useNewUrlParser:true
})

.then( () =>console.log(" MONGO DB IS CONNECTED"))
.catch( err => console.log(err))


app.use('/',router);

app.listen(process.env.PORT || 3000, function() {
    console.log(" EXPRESS APP RUNNING ON PORT " +  (process.env.PORT || 3000));
});