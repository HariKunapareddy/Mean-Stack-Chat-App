'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Chat module Schema
 */
var ChatModuleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Chat module name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ChatModule', ChatModuleSchema);