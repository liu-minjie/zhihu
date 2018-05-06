const mongoose = require('mongoose');
const cacheSchema = new mongoose.Schema({
	id: {
		type: Number
	},
	cache: {
		type: Object
	}
});

module.exports = cacheSchema;