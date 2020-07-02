const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Posts = require('../models/posts');

const feedRouter = express.Router();

feedRouter.use(bodyParser.json());


feedRouter.route('/')
.get((req, res, next) =>{
    console.log("GET on ALL POSTS");
    Posts.find({}).sort({updatedAt: -1}).exec(function(err, allposts){
        if(err){
            console.log(err);
        }
        else
        {
          res.statusCode =200;
          
          
          res.render("./feed",{posts: allposts});
        }
    })
    
})
feedRouter.route('/:id')
.get((req, res, next) =>{
    console.log("GET on a POST");
         Posts.findById(req.params.id, function(err,foundpost){
        if(err)
        console.log(err);
        else
        {
            Posts.find({}).sort({updatedAt: -1}).exec(function(err, allposts){
                if(err){
                    console.log(err);
                }
                else
                {
                  res.statusCode =200;
                  
                  res.render('feedonepost',{post: foundpost, posts: allposts});
                }
            })
           
        }
    })

});



feedRouter.route('/:id')
.get((req, res, next) =>{
    console.log("GET on a POST");
         Posts.findById(req.params.id, function(err,foundpost){
        if(err)
        console.log(err);
        else
        {
            Posts.find({}).sort({updatedAt: -1}).exec(function(err, allposts){
                if(err){
                    console.log(err);
                }
                else
                {
                  res.statusCode =200;
                  
                  res.render('feedonepost',{post: foundpost, posts: allposts,});
                }
            })
           
        }
    })

});



module.exports = feedRouter;