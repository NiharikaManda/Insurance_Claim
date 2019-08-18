var mongoose = require('mongoose');
require('mongoose-long')(mongoose);

var Schema = mongoose.Schema;
var productSchema = new Schema({
    store: { type: String },
    item: { type: String },
    qty: { type: Number },
    price: { type: mongoose.Schema.Types.Long },
    total: { type: mongoose.Schema.Types.Long },
    date: { type: Date }
});
module.exports = mongoose.model('Products', productSchema);