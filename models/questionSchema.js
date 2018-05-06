const mongoose = require('mongoose');
const authorSchema = new mongoose.Schema({
	name: {
		type: String
	},
	url: {
		type: String
	},
	gender: {
		type: Number
	},
	url_token: {
		type: String
	},
	avatar_url: {
		type: String
	},
	id: {
		type: String
	}
});

const questionSchema = new mongoose.Schema({
	id: {
		type: Number
	},
	title: {
		type: String
	},
	created: {
		type: Number
	},
	updated_time: {
		type: Number
	},
	url: {
		type: String
	},
	answer_count: {
		type: Number
	},
	author: {
		type: authorSchema
	},
	tags: {
		type: String
	}
});

module.exports = questionSchema;