const router = require('express').Router();
const User = require("../models/user.model");
const Post  = require("../models/post.model");
const bcrypt = require('bcrypt');



//Get User 

router.get("/:id", async(req,res) => {
 try{
    if(req.body.userId === req.params.id){
        const user = await User.findById(req.params.id);
        const {password, ...every} = user._doc;
        res.status(200).json({every});
    }else{
        res.status(401).json({
            message: "You can only see yours"
        })
    }
 }catch(err){
    res.status(500).json(err,{
        message: "Some Internal Server Issues"
    })
 }
});

//Update User
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password,salt);
        }
        
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body
            },{new:true});

            const {password , ...every} = updatedUser._doc;
            res.status(200).json({every});
        }catch(err){
            res.status(500).send(err);
        }
    }else{
        res.status(401).json("You can only update yours");
    }
});

//Delete User

router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id){
        try{
            //First deleting the posts of the user
            const user = await User.findById(req.params.id);

            if (!user) res.status(404).json({message : "User Not Found"});

            await Post.deleteMany({username : user.username});

            try{
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    message: "User deleted successfully"
    
                });
            }catch(err){
                res.status(500).json(err);
            }
        }catch(err){
            res.status(500).send(err);
        }
    }else{
        res.status(401).json("You can only delete yours");

    }
});



module.exports = router;