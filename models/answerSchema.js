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

const commentSchme = new mongoose.Schema({
	id: {
		type: Number
	},
	content: {
		type: String
	},
	created_time: {
		type: Number
	},
	is_parent_author: {
		type: Boolean
	},
	author: authorSchema,
	reply_to_author: authorSchema
});
const answerSchema = new mongoose.Schema({
	qid: {
		type: Number
	},
	id: {
		type: Number
	},
	created_time: {
		type: Number
	},
	updated_time: {
		type: Number
	},
	voteup_count: {
		type: Number
	},
	content: {
		type: String
	},
	comment_count: {
		type: Number
	},
	author: {
		type: authorSchema
	},
	comment: {
		type: [commentSchme],
		default: []
	}
});

module.exports = answerSchema;