const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//CREATE POST
router.post("/", async (req, res) => {

  const newPost = new Post(req.body);
  const user = await User.findOne({ username: req.body.username });
  !user && res.status(400).json("Wrong credentials!");


  if( user.isAdmin){

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
}
else{
  res.status(200).json("Only admin can allow to update blog ");
}
});
//create comment
router.post("/usercomment/:id", async (req, res) => 
{
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.body.id);

    console.log(user)
    if(user){
   
      try {
        
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,

          
              { $push:
                
                {
                  
                  "users":req.body.username,
                  "userscomment":{"name":req.body.username,"comment":req.body.comment},

                  
                }
        },
          { new: true }
        );
        console.log(updatedPost)

        res.status(200).json(updatedPost);
      } 
      catch (err) {
        res.status(500).json(err);
      }
    }
    else{
      res.status(200).json("user not exist ");
    }
    
});



//create POST
router.put("/admin/:id", async (req, res) => 
{
    const post = await Post.findById(req.params.id);
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");


     console.log(user)
    if(user.isAdmin){

      try {
        
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,

          
              {
                $set:{desc:req.body.desc}
        },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } 
      catch (err) {
        res.status(500).json(err);
      }
    
    }
      else{
        res.status(200).json("Only admin can allow to update blog ");
      }
    
    
  
  
});

//DELETE blog
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  const user = await User.findOne({ username: req.body.username });
  !user && res.status(400).json("Wrong credentials!");

  if(user.isAdmin){

  try {
    const post = await Post.findById(req.params.id);
   
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    
  } catch (err) {
    res.status(500).json(err);
  }

}
else{
  res.status(200).json("Only admin can allow to delete blog ");
}
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
