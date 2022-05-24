const express = require('express')
const app = express()

const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config()

const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')


//MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("Connection Successfull"))
.catch((err)=>console.log(err))

//To Accept Json Post Data
app.use(express.json())

//Routes
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/products',productRoute)
app.use('/api/cart',cartRoute)
app.use('/api/orders',orderRoute)

//App Listen
app.listen(process.env.PORT || 5000, ()=>{
    console.log("backend Running")
})