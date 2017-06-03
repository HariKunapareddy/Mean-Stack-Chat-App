'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    chalk = require('chalk')
var clients={};
var userList=[];
var usersockets=[];

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});

// Init the express application
var app = require('./config/express')(db);
var http = require('http').Server(app);
var io = require('socket.io')(http);
// Bootstrap passport config
require('./config/passport')();


io.on("connection",function (usersocket) {

	usersocket.on("username",function(data,fn){
		usersockets.push(usersocket);
		clients[data]=usersocket.id;
		usersocket.name=data;
		userList.push(data);
		console.log("usename"+data);
        //io.sockets.emit("UpdatedUserList",userList);
        fn(userList);
		usersocket.broadcast.emit("UpdatedUserList",userList);
	//usersocket.emit("UpdatedUserList",userList);
	console.log("updated user emit",userList);

	});
	usersocket.on("disconnect",function(){
        var index1=usersockets.indexOf(usersocket);
        if(index1!=-1){
            usersockets.splice(index1,1);
        }

	var index=userList.indexOf(usersocket.name);
	if(index!=-1){
		userList.splice(index,1);
	}
        usersocket.emit("UpdatedUserList",userList);
	});
	usersocket.on("msgToUser",function (data) {

		console.log("in msg 0"+data);
		if(clients[data.to]!=undefined){
		for(var user in usersockets){
			if(usersockets[user].name==data.to){
				console.log("income server msg to user"+data);
                usersockets[user].emit("IncomingMsg",data);
			}
		}


		}
    })
	usersocket.on("messageToAll",function (data) {
		//usersocket.emit("broadcast",data.message);
		console.log("broad cast"+data);
        io.sockets.emit("broadcast",data);
    });
	setInterval(function () {
		if (userList.length>0){
			var id=Math.floor(Math.random()*userList.length);
            usersockets[id].emit("random message", "hello" +usersockets[id].name+"how r u?");
		}
    },300000)

})
// Start the app by listening on <port>
http.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
