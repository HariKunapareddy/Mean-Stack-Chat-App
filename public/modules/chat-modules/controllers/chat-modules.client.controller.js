'use strict';

// Chat modules controller
angular.module('chat-modules').controller('ChatModulesController', ['$scope', '$stateParams', '$rootScope', '$location', 'socket', 'Authentication', 'ChatModules', 'passToController',
    function ($scope, $stateParams, $rootScope, $location, socket, Authentication, ChatModules, passToController) {
        $scope.authentication = Authentication;
        //var socket = io();
        $scope.userChat1='';
        $scope.userChat2='';
        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
            // or something like
            // socket.removeListener(this);
        });
        socket.on("UpdatedUserList", function (data) {
            console.log(Array.isArray(data));



            console.log($scope.userlist);
            for (var i in data) {
                if(data[i]==passToController.getLoggedInUser()){

                    data.splice(i,1);
                }
                //console.log("user values is" + $scope.userlist[i]);
            }
            $scope.userlist = data.slice(0);
            //$scope.userlist=fruits;
            console.log("updated user "+$scope.userlist);
            console.log("updated uas is" + data);
        })
        socket.on("random message", function (data) {
            console
                .log("random msg" + data);
        })
        socket.on("IncomingMsg", function (data) {
            console.log("incoming" + data);
            $scope.userChat1+= data.from+">>>"+data.to+" : "+data.message+"\n";
        })
        socket.on("broadcast",function (data) {
            $scope.userChat2+= data.from+">>>"+data.to+" : "+data.message+"\n";
        })
        $scope.sendMessage = function () {
            if(typeof $scope.toUser != undefined){
            socket.emit("msgToUser", {
                    from: passToController.getLoggedInUser(),
                    to: $scope.toUser,
                    message: $scope.chatMessage1
                }
            );
            $scope.userChat1+= passToController.getLoggedInUser()+">>>"+$scope.toUser+" : "+$scope.chatMessage1+"\n";
            $scope.chatMessage1='';}

        }
        $scope.sendGroupMessage=function () {

            socket.emit("messageToAll",{from: passToController.getLoggedInUser(),
                to: 'All',
                message: $scope.chatMessage2});
            $scope.chatMessage2='';
        }

        // Create new Chat module
        $scope.create = function () {
            // Create new Chat module object
            var chatModule = new ChatModules({
                name: this.name
            });



            socket.emit("username", $scope.name,function (data) {
                 passToController.setLoggedInUser($scope.name);
                 console.log("data is"+data);
                for (var i in data) {
                    if(data[i]==passToController.getLoggedInUser()){

                        data.splice(i,1);
                    }
                    //console.log("user values is" + $scope.userlist[i]);
                }
                console.log("updats os"+data);
               // console.log("is arrary"+isArray.array(data));
                passToController.setUserList(data);

                $location.path('chat-modules/view');

            });
            $rootScope.loginUser = $scope.name;

            // Redirect after save
            /*			chatModule.$save(function(response) {

             // Clear form fields
             $scope.name = '';

             }, function(errorResponse) {
             $scope.error = errorResponse.data.message;
             });*/
        };

        // Remove existing Chat module
        $scope.remove = function (chatModule) {
            if (chatModule) {
                chatModule.$remove();

                for (var i in $scope.chatModules) {
                    if ($scope.chatModules [i] === chatModule) {
                        $scope.chatModules.splice(i, 1);
                    }
                }
            } else {
                $scope.chatModule.$remove(function () {
                    $location.path('chat-modules');
                });
            }
        };

        // Update existing Chat module
        $scope.update = function () {
            var chatModule = $scope.chatModule;

            chatModule.$update(function () {
                $location.path('chat-modules/' + chatModule._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Chat modules
        $scope.find = function () {
            $scope.chatModules = ChatModules.query();
            $scope.userlist = [
                {
                    id: 1234,
                    name: 'helo',
                    socketId: 1233
                },
                {
                    id: 12345,
                    name: 'hellllo',
                    socketId: 123553
                }


            ];
            $scope.userlist = [];
            // $scope.userlist=['hello','how ru '];
        };

        // Find existing Chat module
        $scope.findOne = function () {
            $scope.chatModule = ChatModules.get({
                chatModuleId: $stateParams.chatModuleId
            });
        };
        $scope.userDetails = function () {
            $scope.userlist = ['hello', 'how ru ', 'check'];
        };
        $scope.selectedUser = function () {
            console.log("selected uesr is" + $scope.selectedName);
            $scope.toUser = $scope.selectedName;

        }
        $scope.viewDetails=function () {
            $scope.loggedInUser=passToController.getLoggedInUser();
            console.log(passToController.getLoggedInUser());
            $scope.userlist=passToController.getUserList();
        }
        $scope.resetChat1=function () {
            $scope.userChat1='';
        }
        $scope.resetChat2=function () {
            $scope.userChat2='';
        }


    }
])
;
