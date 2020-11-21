const express = require('express');
const mongooes = require('mongoose');
const {MONGOURL} = require('./config/keys')

mongooes.connect(MONGOURL,{useNewUrlParser: true, useUnifiedTopology: true})
.then(console.log("connect to db"))
const app = express();
const PORT = process.env.PORT || 5000;


mongooes.connection.on('connected', ()=>{
  console.log("connect to Mongo**");
})

const customeMiddleWare = (erq,res,next) => {
  console.log("middle excuted")
  next()
}

app.get('/', (req,res)=>{
  console.log("home pages**")
  res.send("Home Page")
})


app.get('/about',customeMiddleWare, (req,res)=>{
  console.log("about page***")
  res.send("About Paege")
})


require('./model/user')
require('./model/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.listen(PORT,()=>{
  console.log("server is running on", PORT);
})