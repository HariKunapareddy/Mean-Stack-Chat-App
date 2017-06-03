'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ChatModule = mongoose.model('ChatModule'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, chatModule;

/**
 * Chat module routes tests
 */
describe('Chat module CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Chat module
		user.save(function() {
			chatModule = {
				name: 'Chat module Name'
			};

			done();
		});
	});

	it('should be able to save Chat module instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chat module
				agent.post('/chat-modules')
					.send(chatModule)
					.expect(200)
					.end(function(chatModuleSaveErr, chatModuleSaveRes) {
						// Handle Chat module save error
						if (chatModuleSaveErr) done(chatModuleSaveErr);

						// Get a list of Chat modules
						agent.get('/chat-modules')
							.end(function(chatModulesGetErr, chatModulesGetRes) {
								// Handle Chat module save error
								if (chatModulesGetErr) done(chatModulesGetErr);

								// Get Chat modules list
								var chatModules = chatModulesGetRes.body;

								// Set assertions
								(chatModules[0].user._id).should.equal(userId);
								(chatModules[0].name).should.match('Chat module Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Chat module instance if not logged in', function(done) {
		agent.post('/chat-modules')
			.send(chatModule)
			.expect(401)
			.end(function(chatModuleSaveErr, chatModuleSaveRes) {
				// Call the assertion callback
				done(chatModuleSaveErr);
			});
	});

	it('should not be able to save Chat module instance if no name is provided', function(done) {
		// Invalidate name field
		chatModule.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chat module
				agent.post('/chat-modules')
					.send(chatModule)
					.expect(400)
					.end(function(chatModuleSaveErr, chatModuleSaveRes) {
						// Set message assertion
						(chatModuleSaveRes.body.message).should.match('Please fill Chat module name');
						
						// Handle Chat module save error
						done(chatModuleSaveErr);
					});
			});
	});

	it('should be able to update Chat module instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chat module
				agent.post('/chat-modules')
					.send(chatModule)
					.expect(200)
					.end(function(chatModuleSaveErr, chatModuleSaveRes) {
						// Handle Chat module save error
						if (chatModuleSaveErr) done(chatModuleSaveErr);

						// Update Chat module name
						chatModule.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Chat module
						agent.put('/chat-modules/' + chatModuleSaveRes.body._id)
							.send(chatModule)
							.expect(200)
							.end(function(chatModuleUpdateErr, chatModuleUpdateRes) {
								// Handle Chat module update error
								if (chatModuleUpdateErr) done(chatModuleUpdateErr);

								// Set assertions
								(chatModuleUpdateRes.body._id).should.equal(chatModuleSaveRes.body._id);
								(chatModuleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Chat modules if not signed in', function(done) {
		// Create new Chat module model instance
		var chatModuleObj = new ChatModule(chatModule);

		// Save the Chat module
		chatModuleObj.save(function() {
			// Request Chat modules
			request(app).get('/chat-modules')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Chat module if not signed in', function(done) {
		// Create new Chat module model instance
		var chatModuleObj = new ChatModule(chatModule);

		// Save the Chat module
		chatModuleObj.save(function() {
			request(app).get('/chat-modules/' + chatModuleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', chatModule.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Chat module instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chat module
				agent.post('/chat-modules')
					.send(chatModule)
					.expect(200)
					.end(function(chatModuleSaveErr, chatModuleSaveRes) {
						// Handle Chat module save error
						if (chatModuleSaveErr) done(chatModuleSaveErr);

						// Delete existing Chat module
						agent.delete('/chat-modules/' + chatModuleSaveRes.body._id)
							.send(chatModule)
							.expect(200)
							.end(function(chatModuleDeleteErr, chatModuleDeleteRes) {
								// Handle Chat module error error
								if (chatModuleDeleteErr) done(chatModuleDeleteErr);

								// Set assertions
								(chatModuleDeleteRes.body._id).should.equal(chatModuleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Chat module instance if not signed in', function(done) {
		// Set Chat module user 
		chatModule.user = user;

		// Create new Chat module model instance
		var chatModuleObj = new ChatModule(chatModule);

		// Save the Chat module
		chatModuleObj.save(function() {
			// Try deleting Chat module
			request(app).delete('/chat-modules/' + chatModuleObj._id)
			.expect(401)
			.end(function(chatModuleDeleteErr, chatModuleDeleteRes) {
				// Set message assertion
				(chatModuleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Chat module error error
				done(chatModuleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ChatModule.remove().exec();
		done();
	});
});