// require('server');
const mongoose =require("mongoose");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
module.exports = function(app){


  const User= mongoose.model("User");


  app.get("/search_pending",function(req,res){
    res.redirect("/profile");
  });

  app.post("/search_pending",function(req,res){
    var username=req.body.username;
    console.log(username);
    console.log(req.user.name);

    // username=username.slice(1,username.length);
    // console.log(username);
    User.findOne({username:username},function(err,user){
      if(err)
      {
        console.log(err)
      }
      else{
        if(user)
        {
            User.find({username:{ $regex: /^v/ }},function(err,check){
            if(err)
            console.log(err);
            else{
              var pUsers=[];
              for(var item=0;item<check.length;item++)
              {
                if(check[item].status=="pending")
                {
                  pUsers.push(check[item]);
                }
              }
              // console.log(user.email);
              res.render("pendingRequests.ejs",{Admin_Name:req.user.name,details:pUsers,visitor:user});
              // res.redirect("/");
            }
          })
        }
        else{
          User.find({username:{ $regex: /^v/ }},function(err,check){
            if(err)
            console.log(err);
            else{
              var pUsers=[];
              for(var item=0;item<check.length;item++)
              {
                if(check[item].status=="pending")
                {
                  pUsers.push(check[item]);
                }
              }
                  user={
                    "name":"",
                    "sex":"",
                    "username":"",
                    "address":"",
                    "email":"",
                    "mobile":"",
                    "aadhar":"",
                    "password":"",
                    "status":""
                  };

                      req.session.message={
                        type:'danger',
                        intro:'Invalid ID',
                        message:'Enter valid visitor ID'
                      }
                        res.render("pendingRequests.ejs",{Admin_Name:req.user.name,details:pUsers,visitor:user,message:req.session.message});
                        // res.alert("NOT VALID ID")

                  // res.alert("Enter valid id");

                }
              })
        }

      }
    })
  });

    //other routes..
}
