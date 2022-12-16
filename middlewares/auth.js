const router = require('express').Router();

const User = require("../models/user.model");
const bcrypt = require('bcrypt');


//For Registering Users
router.post("/register", async (req,res) =>{
    try{

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,

        });

        const user = await newUser.save();
        const {password, ...every} = user._doc;

        res.status(201).json({every});

        
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Registering Failed"
        })
    }
});


//For login user

router.post("/login", async(req,res) =>{
    try{
        const user = await User.findOne({username: req.body.username});

        !user && res.status(400).json("Wrong Credentials");

        const validated = await bcrypt.compare(req.body.password, user.password);

        !validated && res.status(400).json("Wrong Credentials");

        //destructuring the user object so that we dont share the password,
        //and also we have destructure it from the _doc of the user

        const {password, ...every} = user._doc;

        res.status(200).json({every});  //it will send everything but the password
        
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
