const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    mobile : {
        type : 'Number',
        required : true
    },
    description : {
        type : String
    },
    date : {
        type : Date,
        default :  Date.now
    }
});

module.exports = profile =mongoose.model('Profile', ProfileSchema);