var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timetableSchema = new Schema(
    {
        date: {type: Date, required: true, unique: true},
        username: {type: String},
        order_date: {type: Date, required: true},
        course: {type: String},
        invalid: {type: Boolean}
    },
    {
        collection: 'timetable'
    }
);

module.exports = mongoose.model('Timetable', timetableSchema);
