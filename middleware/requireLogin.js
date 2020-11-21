const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')
module.exports  = (req,res, next) =>{
  const {authorization}= req.headers;
  console.log("authorization",authorization)
  if(!authorization) {
    res.status(401).json({error: 'you must be Login'})
  }
 const token = authorization.replace("Bearer ","");

 jwt.verify(token, "rohitkamble", (err, payload)=>{
  if(err) {
    res.status(401).json({error: "you must be logged in"})
  }
  const {_id} = payload
  User.findById(_id).then(userdata=>{
    req.user = userdata
    next()
  })
 })

 }