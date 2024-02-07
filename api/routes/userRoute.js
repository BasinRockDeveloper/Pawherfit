const express = require('express')
const router = express.Router()
const mongoose =  require('mongoose')
const user = require('../models/userModel.js')
const userForm = require('../models/userFormModel.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require ('nodemailer')
const dotenv = require('dotenv').config({ path: '../../.env' });
const multer = require('multer');
const auth = require('../../middleware/authMiddleware.js')


// User Created
router.post('/register',async (req,res,next)=>{

    const check_email = req.body.email
    try 
    {
        const existingUser = await user.findOne({ email: check_email });
        const {user_type} = req.body;
        if (existingUser) 
        {
            res.status(200).json({
                success:"false",
                message: "Email Already Exists."
            });
        }
        else
        {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            const newUser = new user({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                gender: req.body.gender,
                email: req.body.email,
                password: hash,
            });
            await newUser.save();

            res.status(200).json({
                success:"true",
                message: "User Created"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(200).json({
            success:false,
            message: err.message
        });
    }
})

// User Log In
router.post('/login', (req,res,next)=>{
    user.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(200).json({
                success:"false",
                message: "User Not Found"
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(result)
            {
                const token = jwt.sign({
                    id:user[0]._id,
                    name:user[0].name,
                    gender:user[0].gender,
                    email:user[0].email,
                    fill_form_status:user[0].fill_form_status
                },
                
                "bafhsd7asu45TX0dbsa8dy98wsdj98",{
                    expiresIn:"24h"
                })
                res.status(200).json({
                    id:user[0].id,
                    name:user[0].name,
                    email:user[0].email,
                    gender:user[0].gender,
                    fill_form_status:user[0].fill_form_status,
                    token:token
                });
            }
            else{
                return res.status(200).json({
                    success:"false",
                    message:"Password Doesn't Match"
                })
            }
        })
    })
    .catch(err=>{
        res.status(200).json({
            success:false,
            message: err.message
        })
    })
})

// Add Fill Form 
router.use('/fill-form',auth)
router.post('/fill-form', async(req,res,next)=>{
    
    const user_exist = await user.findById(req.user._id)
    
    if(user_exist)
    {
        const newUserForm = new userForm({
            _id:new mongoose.Types.ObjectId(),
            userId:user_exist._id,
            about:req.body.about,
            date:req.body.date,
            height:req.body.height,
            weight:req.body.weight,
            weightFormat:req.body.weightFormat,
            aboutRoutine:req.body.aboutRoutine,
        })
        await newUserForm.save();

        if(newUserForm)
        {
            await user.findByIdAndUpdate(user_exist._id,{
                $set:{fill_form_status: 1}
            })
        }

        res.status(200).json({
            success:true,
            message: "User Filled Form Successfully."
        })
    }

    else{
        res.status(200).json({
            success:false,
            message: "User Doesn't Exists."
        })
    }

})


module.exports = router