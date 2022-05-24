const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token

    if(authHeader){
        // In Form : Bearer abfvdhsfgijsdfghui
        const token = authHeader.split(" ")[1];
        
        jwt.verify(token,process.env.JWT_SECRET_KEY, (err,user)=>{
            if(err){
                res.status(403).json("Token is not valid")
            }else{
                req.user = user
                next()
            }
        })

    }else{
        return res.status(401).json("You are not authorized")
    }
}

// All Registered Users & Admin Access
const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not authorized")
        }
    })
}

// Only Admin Access
const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not authorized")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}