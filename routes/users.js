var express = require('express');
var router = express.Router();

const bcrypt = require ('bcrypt')

const User = require ('../models/User')


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/signup',(req,res,next)=>{

  User.find({username: req.body.username}).
  then(resualt=>{
    if(resualt.length <1){
      
  bcrypt.hash(req.body.password , 10 ,(err ,hash)=>{

    if(err){
      res.status(404).json({
        message : err.message
      })
    }else{
      const user = new User({
        username : req.body.username,
        password : hash
    
      })

      user.save().
      then(resault=>{
        console.log(user)
        res.status(200).json({
          message:"user already created "
        })
      }).
      catch(err=>{
        res.status(404).json({
          message : err.message
        })
      })
    }
  })
    }else{
      res.status(404).json({
        message:"can't create it cuz user already created"
      })
    }
  
  }).
  catch(err=>{
    res.status(404).json({
      message : err.message
  })

})
})


router.post('/signin' ,(req,res,next)=>{

  console.log("hi")
  User.find({username: req.body.username}).
  then(user=>{
    if(user.length >= 1){

      bcrypt.compare(req.body.password , user[0].password).
      then(resualt=>{
        if(resualt){
          console.log(resualt)
          res.status(200).json({
            massage : "success sign in"
          })
        }else{
          res.status(404).json({
            message : "wrong password"
          })
        }
      }).
      catch(err=>{
        res.status(404).json({
          message : err.message
        })
      })

    }else{
      res.status(404).json({
        message : "wrong username"
      })
    }
  }).
  catch(err=>{
    res.status(404).json({
      message : err.message
    })
  })

})


module.exports = router;
