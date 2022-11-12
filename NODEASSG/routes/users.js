var express = require('express');
var router = express.Router();
var user=require('../models/user.models');

router.post('/add', function(req, res, next) {
  let newUserDetails = new user({...req.body});
  newUserDetails.save(function(err, newUser){
    if(err){
      res.send({message: err.message})
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send({message:'Saved User Details Sucessfully', newUserObj :  newUserDetails});
    }
  });
});

router.get('/getAll',async function(req, res, next) {
  try{
    let usersDetails = await user.find();
    res.send({message:'Successfully Retrived User Details', users :  usersDetails});
  }catch(err){
    console.log(err);
    res.send({message:'User retrive failed', error :  err.value});
  }
});

router.put('/edit', async function(req, res, next) {
  try{
    const userA = req.body;
    let editUser = await user.where("email").equals(userA.email).findOne();
    if(editUser != null){
      editUser.fullname = userA.fullname;
      editUser.password = userA.password;
    }else{
      res.send({message: "User with the provided email ID is not available, please check the email and try again." , userA});
    }
    await editUser.save();
    res.send(editUser);
  }catch(err){
    res.send({message: err.message});
  }
});

router.delete('/delete', async function(req, res, next) {
  try{
    console.log(req.query.email)
    const userEmail = req.query.email;
    let dltUser = await user.where("email").equals(userEmail).deleteOne();
    res.send({message: "Deleted the User Successfully", dltUser});
  }catch(err){
    res.send({message: "Deletion of the User Failed"});
  }
});
module.exports = router;
