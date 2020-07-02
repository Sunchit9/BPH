const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer =require('multer');




const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }

});
const upload = multer({storage : storage}).array('image_of_item',7);


const Posts = require('../models/posts');
const Comments = require('../models/comments');
const Users= require('../models/users');
const postRouter = express.Router();
postRouter.use(bodyParser.json());





postRouter.route('/')
.get((req, res, next) =>{
    console.log("GET on ALL POSTS");
    Posts.find({}).sort({updatedAt: -1}).exec(function(err, allposts){
        if(err){
            console.log(err);
        }
        else
        {
          res.statusCode =200;
          console.log(req.user);
          
          res.render("./feed",{posts: allposts, currentuser: req.user});
        }
    })
    
})
.post((req, res, next) => {
    upload(req,res,function(err) {
    
    console.log("POST REQUEST ON POST page");
    req.body["images"]=[];
    var i;
    for(i=0;i< req.files.length;i++)
    {
        req.body["images"][i]=req.files[i].originalname;
    }
    /*console.log(req.body);*/
    req.body["comments"] = [];
    console.log(req.body);

    Posts.create(req.body)
    .then((post) => {
    console.log("Post Created", post);
    res.statusCode= 200;
   
    res.redirect('./adminrights');
    }, (err) => next(err))
    .catch((err) => next(err))
    });
});




postRouter.route('/:id')
.get((req, res, next) =>{
    console.log("GET on a POST");
         Posts.findById(req.params.id).populate("comments").exec(function(err,foundpost){
        if(err)
        console.log(err);
        else
        {
            console.log(foundpost);
            Posts.find({}).sort({updatedAt: -1}).exec(function(err, allposts){
                if(err){
                    console.log(err);
                }
                else
                {
                  res.statusCode =200;
                  
                  res.render('feedonepost',{post: foundpost, posts: allposts,currentuser:req.user});
                }
            })
           
        }
    })

});




postRouter.route('/:id/comment')
.post((req, res, next) =>{
    console.log("GET on a POST");
    Posts.findById(req.params.id).populate("comments").exec(function(err,foundpost){
        if(err)
        console.log(err);
        else
        {   
             
            if(req.user.provider !="google")
            {
                console.log(req.user);
                   
            Comments.create(
            {
                text: req.body.comment_of_item,
                author: req.user
            }, function(err, comment){
                if(err)
                {console.log(err);}
                else
                {
                    console.log('hi');
                   comment.author.id= req.user._id;
                   comment.author.username = req.user.displayName;
                   comment.userphoto = req.user.userphoto;

                   console.log(comment);
                   comment.save();
                  foundpost.comments.push(comment);
                    foundpost.save();

                    Posts.find({}).sort({updatedAt: -1}).exec(function(err, allposts){
                        if(err){
                            console.log(err);
                        }
                        else
                        {
                          res.statusCode =200;
                          res.redirect('/'+req.params.id);
                        }
                    })



                }

            })        
           
        
            }
            else
            {

                Users.find({GoogleId: req.user.id},function(err,founduser){
                    if(err)
                    consolo.log(err);

                    else
                    { 
                        console.log(founduser);
                        Comments.create(
                            {
                                text: req.body.comment_of_item,
                                author: founduser[0]
                            }, function(err, comment){
                                if(err)
                                {console.log(err);}
                                else
                                {
                                    console.log(founduser);
                                    console.log('hi-google');
                                   comment.author.username = founduser[0].displayName;
                                   comment.author.userphoto = founduser[0].userphoto;
                                   comment.author.username
                                   console.log(comment);
                                   comment.save();
                                  foundpost.comments.push(comment);
                                    foundpost.save();
                
                                    Posts.find({}).sort({updatedAt: -1}).exec(function(err, allposts){
                                        if(err){
                                            console.log(err);
                                        }
                                        else
                                        {
                                          res.statusCode =200;
                                          res.redirect('/'+req.params.id);
                                        }
                                    })
                
                
                
                                }
                
                            })        
                           




                    }
                })
            }
    }
    })

});






module.exports = postRouter;