'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var chatModules = require('../../app/controllers/chat-modules.server.controller');

	// Chat modules Routes
	app.route('/chat-modules')
		.get(chatModules.list)
		.post(chatModules.create);
		//.post(users.requiresLogin, chatModules.create);

	app.route('/chat-modules/:chatModuleId')
		.get(chatModules.read)
		.put(users.requiresLogin, chatModules.hasAuthorization, chatModules.update)
		.delete(users.requiresLogin, chatModules.hasAuthorization, chatModules.delete);

	// Finish by binding the Chat module middleware
	app.param('chatModuleId', chatModules.chatModuleByID);
};
