const router = require('express').Router()
const Order = require('../models/Order')
const {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require('./verifyToken')

//Insert Order
router.post("/", verifyToken,async(req,res)=>{
    const newOrder = new Order(req.body)
    try{
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// Update Order
// Admin Access Only
router.put("/:id",verifyTokenAndAdmin, async (req,res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})
        res.status(200).json(updatedOrder)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// Delete Order
// Admin Access Only
router.delete("/:id",verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")
    }
    catch(err){
        res.status(500).json(err) 
    }
})

// Get Order
// Here id indicates userId not order id.

router.get("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const orders = await Order.find({userId: req.params.id})
        res.status(200).json(orders)
    }
    catch(err){
        res.status(500).json(err) 
    }
})

// Get All Orders (All user's Orders)
// Only Admin Access
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const orders = await Order.find()
        res.status(200).json(orders)
    }
    catch(err){
        res.status(500).json(err) 
    }
})

module.exports = router