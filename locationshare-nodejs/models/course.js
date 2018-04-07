var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema(
    {
        code: {type: String, required: true, unique: true},
        posts: [{
            text: {type: String, required: true},
            author: {type: String, required: true},
            date: {type: Date, required: true},
            responses: [{
                text: {type: String, required: true}
            }]
        }],
        pinned: [{
            text: {type: String, required: true},
            author: {type: String, required: true},
            date: {type: Date, required: true},
            responses: [{
                text: {type: String, required: true}
            }]
        }],
        tutors: [String],
        students: [String]
    },
    {
        collection: 'courses'
    }
);

module.exports = mongoose.model('Course', courseSchema);
