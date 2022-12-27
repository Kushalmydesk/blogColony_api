const router = require('express').Router();
const User = require("../models/user.model");
const Post = require("../models/post.model");


//Create a new Post
router.post("/", async(req,res) => {
    const newpost = new Post(req.body);

    try{
        const savedPost = await newpost.save();

        res.status(201).json(savedPost);
    }catch(err){
        res.status(500).json(err,{
            message: "Some Internal Error",
        })
    }
});


//To get a post 

router.get("/:id" , async(req,res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        res.status(404).json({
            message: " No Post found"
        })
    }

    
    res.status(200).json({
        title : post.title,
        desc : post.desc,
        username : post.username,
        createdAt: post.createdAt,
        categories : post.categories
    })
});


//get all posts

router.get("/", async(req,res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try{
        let posts ;

        if(username){
            posts = await Post.find({username: username});
        }else if(catName){
            posts = await Post.find({
                categories: {
                    $in: [catName]
                },
            })
        }else{
            posts = await Post.find();
        }
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json(err);
    }


});

//Update a post

router.put("/:id" , async(req,res) => {
    try{
        const post  = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try{
                const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
                  $set: req.body,   
                },{
                    new:true
                });
                res.status(200).json(updatedPost);
            }catch(err){
                res.status(500).send({
                    message: "Some Internal Error",
                })
            }
        }else{
            res.status(401).send({
                message: "Unauthorized"

            })
        }   
        

    }catch(err){
        res.status(500).json(err,{
            message: "Some Internal Error",
        })
    }
});


//to delete a post 

router.delete("/:id" , async(req,res) => {
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username){
        try{
            await post.delete();
            res.status(200).send({
                message : "The post has been deleted Successfully"
            })


        }catch(err){
            res.status(500).json({
                message: "Some Internal Error",
            })
        }
    }else{
        res.status(401).send({
            message: "You can only delete yours"
        });

    }
});
module.exports = router;