const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true
    },
    gender:{
        enum: ['male', 'female', 'other'],
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    fill_form_status:{
        type:Number,
        default:0,
        required:true
    },
    
})

module.exports = mongoose.model('User',UserSchema)