module.exports = function (mongoose) {
	const issueSchema = mongoose.Schema({
		project: {
			required: true,
			type: String,
			select: false
		},
		issue_title: {
			required: true,
			type: String
		},
		issue_text: {
			required: true,
			type: String
		},
		created_by: {
			required: true,
			type: String
		},
		created_on: {
			type: Date,
			default: Date.now
		},
		updated_on: {
			type: Date,
			default: Date.now
		},
		assigned_to: {
			default: '',
			type: String
		},
		open: {
			type: Boolean,
			default: true
		},
		status_text: {
			default: '',
			type: String
		}
	}, {
			versionKey: false // You should be aware of the outcome after set to false
		});
	return mongoose.model('Issue', issueSchema);
}