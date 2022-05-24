const router = require('express').Router()
const User = require('../models/User')
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')

// Update User
router.put("/:id",verifyTokenAndAuthorization, async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString()
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})

        res.status(200).json(updatedUser)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// Delete User
router.delete("/:id",verifyTokenAndAuthorization, async (req,res)=>{

    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    }
    catch(err){
        res.status(500).json(err) 
    }
})

// Get User
router.get("/:id",verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        // Remvoing password from result
        const {password, ...others} = user._doc
        res.status(200).json(others)
    }
    catch(err){
        res.status(500).json(err) 
    }
})

// Get All Users And Use Of Query
router.get("/",verifyTokenAndAdmin, async (req,res)=>{
    try{
        // Query can be send from URL
        // EX: http://localhost:5000/api/users?new=true
        // if query present only send last user
        // use of ternery operator
        const query = req.query.new

        const users = query 
        ? await User.find().sort({_id:-1}).limit(1) 
        : await User.find()

        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json(err) 
    }
})

module.exports = router