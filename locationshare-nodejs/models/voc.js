var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vocSchema = new Schema(
    {
        index: {
            type: Number, required: true, unique: true
        },
        content: [String]
    },
    {
        collection: 'vocs'
    }
);

module.exports = mongoose.model('Voc', vocSchema);
