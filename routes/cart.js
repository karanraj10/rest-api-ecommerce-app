const router = require('express').Router()
const Cart = require('../models/Cart')
const {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require('./verifyToken')

//Insert Cart
router.post("/", verifyToken,async(req,res)=>{

    const userId = req.body.userId
    const product = req.body.product

    try{
        const findUser = await Cart.findOne({userId: userId})
        if(findUser){
            findUser.products.push(product)
            const savedCart = await findUser.save()
            res.status(200).json(savedCart)
        }else{
            const newCart = new Cart({
                userId: userId,
                products: product
            })
            const savedCart = await newCart.save()
            res.status(200).json(savedCart)
        }
    }
    catch(err){
        res.status(500).json(err)
    }

})

// Update Cart
router.put("/:id",verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})
        res.status(200).json(updatedCart)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// Delete Cart
router.delete("/:id",verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted")
    }
    catch(err){
        res.status(500).json(err) 
    }
})

// Get Cart
router.get("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const cart = await Cart.findOne({userId: req.params.id})
        res.status(200).json(cart)
    }
    catch(err){
        res.status(500).json(err) 
    }
})

// Get All Cart (All user's cart)
// Only Admin Access
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }
    catch(err){
        res.status(500).json(err) 
    }
})

module.exports = router