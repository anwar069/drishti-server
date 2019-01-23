var express = require('express');
var cors = require('cors');
var app = express();
var fs = require("fs");
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// mongoose.connect('mongodb://localhost/rest-demo');

// uri:'mongodb://104.196.243.161:27017',
// options:{
//   user:'root',
//   pass:'YVRuaA8Wbwuu',
//   dbName:'DrishtiFullstackTest'
// }
// mongoose.connect('mongodb://root:YVRuaA8Wbwuu@104.196.243.161:27017/DrishtiFullstackTest?authSource=DrishtiFullstackTest&w=1',{useNewUrlParser: true});
// mongoose.connect('mongodb://root:YVRuaA8Wbwuu@104.196.243.161:27017/DrishtiFullstackTest',{auth:{authdb:"admin"}});

mongoose.connect("mongodb://104.196.243.161:27017/DrishtiFullstackTest", { auth:{

    authdb: 'admin',
    user: 'root',
    password: 'YVRuaA8Wbwuu'

}}).then(function(db){

    // do whatever you want
    console.log('Connected')

    // mongoose.connection.close() // close db

})
mongoose.set('debug', true); // turn on debug
var conn = mongoose.connection;
var Schema = mongoose.Schema;

// create a schema
var actionsSchema = new Schema({
    dish:String, //The dish that was being prepared
    station: String,// The station at which the action was performed
    duration: Number,// The duration for which the action was performed
    startTime: String, //The start time of the action expressed as a UTC date String
    action:String 
}, { collection: 'actions' });

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('actions', actionsSchema);

app.get('/actions', function (req, res) {
    console.log("Req");
    // get all the users
    let response={};
    User.find({}, function (err, actions) {
        if (err) throw err;
        // object of all the actions
        console.log('actions', actions);

        response['actionCount']=actions.length;
        response['data']=actions;

        let dishes={};
        let acts={};
        let stations={};
        // Dishes Aggregator
        let totalDuration=0;

        actions.forEach(action => {

            totalDuration+= action.duration;
            if(!dishes[action.dish]){
                dishes[action.dish]=action.duration;
            }else{
                dishes[action.dish]+=action.duration;
            }

            if(!stations[action.station]){
                stations[action.station]=action.duration;
            }else{
                stations[action.station]+=action.duration;
            }

            if(!acts[action.action]){
                acts[action.action]=action.duration;
            }else{
                acts[action.action]+=action.duration;
            }
        });

        
        response['totalDuration']=totalDuration;
        response['avgDuration']=totalDuration/actions.length;
        response['dishes']=dishes;
        response['stations']=stations;
        response['actions']=acts;
        res.send(response);
    });
    // res.send('Yayy');
})

// POST http://localhost:8080/api/users
// parameters sent with 


// make this available to our users in our Node applications
module.exports = User;

var server = app.listen(8080, function () {
    console.log("Example app listening at 8080");
})