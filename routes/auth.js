const express = require('express')
const router = express.Router()
const mongooes = require('mongoose')
const User = mongooes.model('User')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const {JWT_SECRET} = require('../config/keys')

router.post('/signup', (req, res) => {
  const {name, email, password, pic} = req.body
  if(!email || !password || !name) {
    return res.status(422).json({error: "please add all field"})
  }
  User.findOne({email: email})
  .then((saveuser)=>{
    if(saveuser) {
      return res.status(422).json({error: "alerady exist"})
    }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
      const users = new User({
        email,
        password: hashedpassword,
        name,
        pic
      })
      users.save()
      .then((users)=>{
        res.json({message: "saved successfully"})
      })
      .catch(err=>{
        console.log("err", err)
      })
    })
    .catch(err=>{
      console.log(err)
    })
  })
  .catch(err=>{
    console.log(err)
  })
})

router.get('/proected', requireLogin, (req, res)=>{
  res.send("hello user")
})

router.post('/signin', (req, res)=>{
  const {email, password} = req.body
  if(!email || !password) {
    res.status(422).json({error: "please add email or password"})
  }
  User.findOne({email: email})
  .then(saveuser=>{
    if(!saveuser){
      return res.status(422).json({error: "invalid Email or Password"})
    }
    bcrypt.compare(password,saveuser.password)
    .then(domatch=>{
      if(domatch){
        // res.json({message:"suceesfully signed in"})
        const token = jwt.sign({_id: saveuser._id}, JWT_SECRET)
        const {_id, name, email, followers, following, pic} = saveuser;
        res.json({token, user:{_id, name, email, followers, following, pic}})
      }
      else {
        return res.status(422).json({error: "invalid Email or password"})
      }
    })
    .catch (err=>{
      console.log(err)
    })
  })
})

module.exports = router