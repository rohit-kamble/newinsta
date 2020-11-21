const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require("../middleware/requireLogin")
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id',requireLogin, (req,res)=>{
  // console.log("req user**", req)
  User.findOne({_id: req.params.id})
  .select("-password")
  .then(user=>{
      Post.find({postedBy: req.params.id})
      .populate("postedBy","_id, name")
      .exec((err, posts)=>{
        if(err){
          return res.status(422).json({error: err})
        }
        console.log("postes**",user, posts)
        res.json({user,posts})
      })
  })
  .catch(err=>{
    return res.status(404).json({error:"User not Found"})
  })
})

router.put('/follow', requireLogin, (req,res)=>{
  // console.log("req follow**", req.user._id)
  User.findByIdAndUpdate(req.body.follower, {
    $push: {followers: req.user._id}
  },{
    new: true
  },(err, result) => {
    if(err) {
      return res.status(422).json({error: err})
    }
    // console.log("req.iuser==", req.body)
    User.findByIdAndUpdate(req.user._id,{
      $push: {following: req.body.follower}
     }, {
       new: true
      }
     )
     .select("-password")
    //  .populate("postedBy","_id name")
     .then(result=>{res.json(result); console.log("result**", result)})
     .catch(err=>{
       return res.status(422).json({error: err})
     })
  })
})

router.put('/unfollow', requireLogin, (req,res)=>{
  // console.log("req**", req.user)
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: {followers: req.user._id}
  },{
    new: true
  },(err, result) => {
    if(err) {
      return res.status(422).json({error: err})
    }
    User.findByIdAndUpdate(req.user._id,{
      $pull: {following: req.body.unfollowId}
     }, {
       new: true
      }
     )
     .select("-password")
    //  .populate("postedBy","_id name")
     .then(result=>res.json(result))
     .catch(err=>{
       return res.status(422).json({error: err})
     })
  })
})

router.put('/updatedpic',requireLogin, (req,res)=>{
  User.findByIdAndUpdate(req.user._id,{$set: {pic: req.body.pic}},
    {new: true},
    (err, result)=>{
      if(err) {
        return res.status(422).json({error: "pic cannot Post"})
      }
      res.json(result)
    })
})

module.exports = router