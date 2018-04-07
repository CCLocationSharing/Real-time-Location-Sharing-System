var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema(
    {
        // True if it's a post of a student requiring for a tutor;
        // False if it's a post of a tutor providing tutoring.
        is_student: {type: Boolean, required: true},
        username: {type: String, required: true},
        subject: {type: String, required: true},
        title: {type: String, required: true},
        range: {type:  Number, required: true},
        detail: {type: String, required: true},
        when: {type: String, required: true},
        date: {type: Date, required: true}
    },
    {
        collection: 'posts'
    }
);

module.exports = mongoose.model('Post', postSchema);
