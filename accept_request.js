// require('server');
const mongoose =require("mongoose");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const nodemailer = require('nodemailer');
var QRCode = require('qrcode')
module.exports = function(app){


  const User= mongoose.model("User");


  app.get("/accept_request",function(req,res){
  // console.log(req.user.username);

      res.redirect("/profile");

  });
  app.post("/accept_request",function(req,res){
  // console.log(req.user.username);
   var username=req.body.username;
   User.findOne({username:username},function(err,user){
     if(err)
     {
       console.log(err)
     }
     else{
       if(user && user.status=="pending")
       {
           User.updateOne({username:req.body.username},{status:"approved"},function(){
             var transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                 user: process.env.GMAIL_ID,
                 pass: process.env.GMAIL_PASS
               }
             });
             var mailOptions = {
               from: process.env.GMAIL_ID,
               to: user.email,
               subject: 'Status Update',
               text: 'Your Visit has been approved!!. Your status wiil be set to as active at 12:00 am on your requested day of visit.\n You can check your status at your profile. You can use your username ( '+username+' ) and password to login. Here is the link of the website: https://vms-sasy.herokuapp.com/',
               attachDataUrls: true,
               // html:'<b>Thanks for visiting the building.</b>'+
               //      'Your username has been deactivated successfully<br>'+
               //      'You can no logner use your username and password to login to <a href="https://vms-sasy.herokuapp.com/" target="_blank">VMS</a>'
             };

             transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                 console.log(error);
               } else {
                 console.log('Email sent: ' + info.response);
               }
             });
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
                     type:'success',
                     intro:'Status Updated',
                     message:'Visitor request accepted. Status set to approved.'
                   }
                   res.render("pendingRequests.ejs",{Admin_Name:req.user.name,details:pUsers,visitor:user,message:req.session.message});
                   // res.redirect("/");
                 }
               })
           });
       }
       else{

         //USER DOES NPT EXIST MESSAGE
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
                 // User.find({username:{ $regex: /^v/ }},function(err,check){
                 //   if(err)
                 //   console.log(err);
                 //   else{
                     req.session.message={
                       type:'danger',
                       intro:'Invalid ID',
                       message:'Enter valid visitor ID'
                     }
                       res.render("pendingRequests.ejs",{Admin_Name:req.user.name,details:check,visitor:pUsers,message:req.session.message});
                       // res.alert("NOT VALID ID")
                   }
                 });
                 // res.alert("Enter valid id");

               }
             }
           })
   });


    //other routes..
}
