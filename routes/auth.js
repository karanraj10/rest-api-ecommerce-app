const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// Register
router.post("/register",async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY),
        isAdmin: req.body.isAdmin
    })

    try{
        const saveduser = await newUser.save()
        res.status(201).json(saveduser)
    }
    catch(err){
        res.status(500).json(err)
    }
    
})

// Login
router.post("/login", async (req,res)=>{

    try{
        const user = await User.findOne({ username: req.body.username })

        if(!user){
            res.status(401).json("Wrong Credentials")
        }
        else{
            const hashedPassword = CryptoJS.AES.decrypt(user.password,process.env.SECRET_KEY)
            const password = hashedPassword.toString(CryptoJS.enc.Utf8)
            
            if(password != req.body.password){
                res.status(401).json("Wrong Credentials")
            }
            else{

                //JWT Token
                const accessToken = jwt.sign({
                    id:user.id,
                    isAdmin:user.isAdmin
                }, process.env.JWT_SECRET_KEY,
                {expiresIn:"3d"})

                res.status(200).json({user, accessToken})

                // it will send all user details
                // to prevent password from sending:
                // const {password, ...others} = user._doc
                //res.status(200).json(...others)

                // Mongodb stores all info in _doc
            }
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router