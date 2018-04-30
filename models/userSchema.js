const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
	id: {
		type: String
	},
	name: {
		type: String
	},
	url: {
		type: String
	},
	gender: {
		type: Number
	},
	avatar_url: {
		type: String
	},
	badge: {
		type: String
	}
});

module.exports = userSchema;