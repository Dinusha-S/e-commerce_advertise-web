const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    userID:{//use university id 
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar : {
        type: String
    },
    password:{
        type: String,
        required: true
    },
    date: {
        type : Date,
        default : Date.now
    }

})

module.exports = user = mongoose.model("User",userSchema);