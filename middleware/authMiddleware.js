const jwt = require('jsonwebtoken')
const UserModal = require('../api/models/userModel.js')
const dotenv = require('dotenv').config({ path: '../../.env' });

var CheckUserAuth = async(req,res,next)=>{
    let token
    const {authorization} = req.headers

    if(authorization && authorization.startsWith('Bearer')){
        try {
            token = authorization.split(' ')[1]
            const DecodedToken = jwt.verify(token,"bafhsd7asu45TX0dbsa8dy98wsdj98")
            const id = DecodedToken.id
            req.user = await UserModal.findById(id).select('-password')
            next()
        } catch (error) {
            console.log("error")
            res.status(200).json({
                success:false,
                message : error.message
            })
        }
    }
    if(!token){
        res.status(200).json({
            success:false,
            message:"Un Authorized Access"
        })
    }
}

module.exports = CheckUserAuth