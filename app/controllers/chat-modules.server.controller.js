'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ChatModule = mongoose.model('ChatModule'),
	_ = require('lodash');

/**
 * Create a Chat module
 */
exports.create = function(req, res) {
	var chatModule = new ChatModule(req.body);
	chatModule.user = req.user;

	chatModule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chatModule);
		}
	});
};

/**
 * Show the current Chat module
 */
exports.read = function(req, res) {
	res.jsonp(req.chatModule);
};

/**
 * Update a Chat module
 */
exports.update = function(req, res) {
	var chatModule = req.chatModule ;

	chatModule = _.extend(chatModule , req.body);

	chatModule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chatModule);
		}
	});
};

/**
 * Delete an Chat module
 */
exports.delete = function(req, res) {
	var chatModule = req.chatModule ;

	chatModule.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chatModule);
		}
	});
};

/**
 * List of Chat modules
 */
exports.list = function(req, res) { 
	ChatModule.find().sort('-created').populate('user', 'displayName').exec(function(err, chatModules) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chatModules);
		}
	});
};

/**
 * Chat module middleware
 */
exports.chatModuleByID = function(req, res, next, id) { 
	ChatModule.findById(id).populate('user', 'displayName').exec(function(err, chatModule) {
		if (err) return next(err);
		if (! chatModule) return next(new Error('Failed to load Chat module ' + id));
		req.chatModule = chatModule ;
		next();
	});
};

/**
 * Chat module authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.chatModule.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
