'use strict';

//Chat modules service used to communicate Chat modules REST endpoints
angular.module('chat-modules').factory('ChatModules', ['$resource',
	function($resource) {
		return $resource('chat-modules/:chatModuleId', { chatModuleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('chat-modules').factory('usersocket',['socketFactory',function (socketFactory) {

  return socketFactory();
}]);
angular.module('chat-modules').factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        removeAllListeners: function (eventName, callback) {
            socket.removeAllListeners(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }

    }
});
angular.module('chat-modules').factory('passToController',function () {

var loggedInUser='';
var userList=[];

function setLoggedInUser(user) {

    loggedInUser=user;
}
function getLoggedInUser() {
    return loggedInUser;

}

function setUserList(users) {
userList=users;
}
function getUserList() {
    return userList;
}
return{
    setLoggedInUser:setLoggedInUser,
    getLoggedInUser:getLoggedInUser,
    setUserList:setUserList,
    getUserList:getUserList

}
})
