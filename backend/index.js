const port= 4000;
const express= require("express");
const app= express();
const mongoose= require("mongoose");
const jwt= require("jsonwebtoken");
const multer= require("multer");
const path= require("path");
const cors= require("cors");
const { error, log } = require("console");
const { CLIENT_RENEG_WINDOW } = require("tls");
const { type } = require("os");
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

// Database connection with mongodb
mongoose.connect("mongodb+srv://dev59:dev57896@cluster0.4iedusk.mongodb.net/cluster?retryWrites=true&w=majority&appName=Cluster0");

//API Creation
app.get("/",(req,res)=>{
    res.send("Express App is Running");
})

// IMage Storage Engine

const storage= multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload= multer({storage:storage})

//Creating upload endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//schema for creating products

const Product= mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
        unique: true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,

    },
    category:{
        type: String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,

    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,

    }
})

app.post('/addproduct',async(req,res)=>{
    let products= await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array= products.slice(-1);
        let last_product= last_product_array[0];
        id= last_product.id+1;
    }
    else{
        id=1;
    }
    // console.log("Generated ID:", id);
    const product= new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})
// creating API for deleting products
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})
// creating API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products= await Product.find({}).limit(400);
    console.log("All Products Fetched");
    res.send(products);
})

//Schema creating for user model

const Users = mongoose.model('Users',{
    name:{
        type: String,

    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type: String,

    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating end point for registring user
app.post('/signup',async(req,res)=>{

    let check= await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found withnsame email address"})
    }
    let cart={};
    for (let i = 0; i <300; i++) {
        cart[i]=0;
        
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user= new Users({
        name: req.body.username,
        email:req.body.email,
        password:hashedPassword,
        cartData:cart,
    })

    await user.save();

    const data={
        user:{
            id:user.id,
        }
    }
    const token= jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// creating endpoints for user login

app.post('/login',async(req,res)=>{
    let user= await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        console.log(`Plain Password: ${req.body.password}`);
        console.log(`Hashed Password: ${user.password}`);
        console.log(`Password Match: ${passCompare}`);
        if(passCompare){
            const data={
                user:{
                    id:user.id,
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"});
    }

})

//creating endpoint for new collection data
app.get('/newcollections',async(req,res)=>{
    let products= await Product.find({}).limit(400);
    let newcollection= products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// creating endpoint for popular in women
app.get('/popularinwomen',async(req,res)=>{
    let products= await Product.find({category:"women"}).limit(400);
    let popular_in_women= products.slice(0,4);
    console.log("Popular in Women Fetched");
    res.send(popular_in_women);
})

// creating endpoint for adding products in cart data
app.post('/addtocart',async(req,res)=>{
   console.log(req.body);
})


app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running On Port "+port);
    }
    else{
        console.log("Error : "+error)
    }
})