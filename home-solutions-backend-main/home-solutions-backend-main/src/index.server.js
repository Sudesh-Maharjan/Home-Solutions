const express=require('express')
const app=express()
const path=require('path')
const bodyParser=require('body-parser')
const cors=require('cors')

// environment variable or you can say constants
const env=require('dotenv')
env.config()

// mongodb connection
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin123@cluster0.pabt1lh.mongodb.net/homesolution?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true,
}).then(()=>{
    console.log('Database connected Successfully.')
})

// Routes:
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/admin/adminRoute')
const categoryRoute=require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute')
const cartRoute=require('./routes/cartRoute')
const initialDataRoute=require('./routes/admin/initialDataRoute')
const filter=require("./routes/filterRoute")

// mongodb connection:
// mongodb+srv://suwasghale2281:<password>@cluster0.tibtbun.mongodb.net/?retryWrites=true&w=majority



app.use(express.json())

app.get('/' , (req,res,next)=>{
    res.status(200).json({
        message:'Hello from Express Server.'
    })
})
app.post('/data' , (req,res,next)=>{
    res.status(200).json({
        message:req.body
    })
})

// middlewares:
app.use(bodyParser.json())
app.use(cors())
app.use('/public',express.static(path.join(__dirname,'uploads')))
app.use('/api',userRoute)
app.use('/api', adminRoute)
app.use('/api', categoryRoute)
app.use('/api', productRoute)
app.use('/api', cartRoute)
app.use('/api', initialDataRoute)
// app.use('/api',filter )


app.listen(process.env.PORT, ()=>{
    console.log(`Server started on ${process.env.PORT}`)
})