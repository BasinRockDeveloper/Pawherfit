const mongoose = require('mongoose')

const UserFormSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    about:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    height:{
        type:String,
        required:true
    },
    weight:{
        type:String,
        required:true
    },
    weightFormat: {
        type:String,
        required:true
    },
    aboutRoutine:{
        type:String,
        required:true
    },
    
})

module.exports = mongoose.model('UserForm',UserFormSchema)