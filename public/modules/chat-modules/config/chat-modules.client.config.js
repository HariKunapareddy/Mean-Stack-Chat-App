'use strict';

// Configuring the Articles module
angular.module('chat-modules').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Chat modules', 'chat-modules', 'dropdown', '/chat-modules(/create)?');
		Menus.addSubMenuItem('topbar', 'chat-modules', 'List Chat modules', 'chat-modules');
		Menus.addSubMenuItem('topbar', 'chat-modules', 'New Chat module', 'chat-modules/create');
	}
]);