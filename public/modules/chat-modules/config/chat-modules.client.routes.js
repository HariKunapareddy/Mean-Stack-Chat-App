'use strict';

//Setting up route
angular.module('chat-modules').config(['$stateProvider',
	function($stateProvider) {
		// Chat modules state routing
		$stateProvider.
		state('listChatModules', {
			url: '/chat-modules',
			templateUrl: 'modules/chat-modules/views/list-chat-modules.client.view.html'
		}).
		state('createChatModule', {
			url: '/chat-modules/create',
			templateUrl: 'modules/chat-modules/views/create-chat-module.client.view.html'
		}).
		state('viewChatModule', {
			url: '/chat-modules/view',
			templateUrl: 'modules/chat-modules/views/view-chat-module.client.view.html'
		}).
		state('editChatModule', {
			url: '/chat-modules/:chatModuleId/edit',
			templateUrl: 'modules/chat-modules/views/edit-chat-module.client.view.html'
		}).
		state('homepage', {
			url: '/homepage',
			templateUrl: 'modules/chat-modules/views/home.html'
		});
	}
]);
