//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "Hi, Here you can publish your daily Journal";
const aboutContent = "I am Anant, 4th year Software Engineering student at DTU.";
const contactContent = "For further information, you can contact anantjain245@gmail.com";

const app = express();
let posts=[];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const PostModel = mongoose.model("PostCollection", {
   PostCollectionTitle: String,
   PostCollectionContent:String});

//Read DB and add it to posts array only if anything has not been added i.e. when we are restarting our server
if(posts.length===0){
    PostModel.find({},function(err,results){
    if(!err){
      results.forEach(function(EachResult){
        var PostToAddInDB={
          id:EachResult._id,
          title:EachResult.PostCollectionTitle,
          comment:EachResult.PostCollectionContent
        };
      posts.push(PostToAddInDB);
       });
    }
    else{
        console.log(err);
      }
    });
}

app.get("/posts/:postName",function(req,res) {
  const requestedID=req.params.postName;
  posts.forEach(function(post)
  {
    var storedID=post.id;
      if(storedID==requestedID){
        res.render(__dirname+"/views/post.ejs",{Title:post.title,Content:post.comment});
      }
  }
  );

});

app.get("/",function (req,res) {
    res.render(__dirname+"/views/home.ejs",{StartingContent:homeStartingContent,Posts:posts});
});

app.get("/compose",function(req,res) {
  res.render(__dirname+"/views/compose.ejs");
});
app.post("/compose",function(req,res) {
    const post={
      id:1,
      title:req.body.postTitle,
      comment:req.body.postBody
    };
    posts.push(post);
    //Add this post to DB and save it to DB
    var NewPost = new PostModel({
      PostCollectionTitle : post.title,
      PostCollectionContent: post.comment});
    NewPost.save(function(err,res){
      post.id=res.id;
    });
    res.redirect("/");
});

app.get("/about",function(req,res){
  res.render(__dirname+"/views/about.ejs",{aboutContent :aboutContent});
});

app.get("/contact",function(req,res){
  res.render(__dirname+"/views/contact.ejs",{contactContent :contactContent});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
