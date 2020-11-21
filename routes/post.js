const express = require('express')
const routesr = express.Router()
const mongoose = require('mongoose')
const router = require('./auth')
const requireLogin = require('../middleware/requireLogin')
const { route } = require('./auth')
const Post = mongoose.model("Post")
const User = mongoose.model('User')
router.get('/allpost', requireLogin, (req,res)=>{

  Post.find()
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .then(posts=>[
    res.json({posts})
  ])
  .catch(err=>{
    console.log(err)
  })
})

router.get('/getSubPost', requireLogin, (req,res)=>{
  console.log("req**", req.user)
  Post.find({ postedBy:{$in:req.user.following}})
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .then(posts=>[
    res.json({posts})
  ])
  .catch(err=>{
    console.log(err)
  })
})

router.post('/cretaepost', requireLogin, (req,res)=>{
  console.log("req.body", req.body)
  const { title, body, photo}=req.body
  if(!title || !body || !photo) {
    return res.status(422).json({error: "Please add all the fields"})
  }
  console.log("req.user", req.user)
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user
  })
  post.save()
  .then(result=>{
    res.json({post:result})
  })
  .catch(err=>{
    console.log(err)
  })
})

router.get('/mypost',requireLogin, (req,res)=>{
  Post.find({postedBy: req.user._id})
  .populate("PostedBy","_id name")
  .then(mypost=>{
    res.json({mypost})
  })
  .catch(err=>{
    console.log(err)
  })
})

router.put("/like", requireLogin, (req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $push: {likes: req.user._id}
  },{
    new: true
  })
  .populate("postedBy","_id name")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error: err})
    }
    else {
      res.json(result)
    }
  })
})

router.put("/unlike", requireLogin, (req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $pull: {likes: req.user._id}
  },{
    new: true
  })
  .populate("postedBy","_id name")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error: err})
    }
    else {
      res.json(result)
    }
  })
})

router.put('/comment', requireLogin, (req,res)=>{
  console.log("req**", req.body.name)
  const comment ={
    text: req.body.text,
    postedBy: req.user._id,
    name: req.body.name
  }
  Post.findByIdAndUpdate(req.body.postId, {
    $push: {comments: comment}
  },{
    new: true
  })
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((err, result)=>{
    if(err){
      return res.status(422).json({error: err})
    }
    else {
      res.json(result)
    }
  })
})
router.delete('/deletecomment/:postId/:commentId',requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.params.postId, {
    $pull:  { comments: {_id:req.params.commentId} }
  }, {
    new : true
  })
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error: err})
    }
    else {
      res.json(result)
    }
  })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
  Post.findOne({_id: req.params.postId})
  .populate('postedBy','_id')
  .exec((err, post)=>{
    if(err || !post){
      return req.status(422).json({error: err})
    }
    if(post.postedBy._id.toString() === req.user._id.toString()){
      post.remove()
      .then(result=>{res.json(result)})
      .catch(err=>console.log(err))
    }
  })
})

router.get('/users', (req,res)=>{

  User.find()
  .then(data=> res.json(data))
  .catch(err=>{
    console.log(err)
  })
})
module.exports = router