const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//mongoose.connect('mongodb://127.0.0.1:27017/BlogDB');
mongoose.connect("mongodb+srv://AnmolSoni:Anmol123@clusterdemo.fy865bw.mongodb.net/BlogDB?retryWrites=true&w=majority");

const postSchema = new mongoose.Schema({
    name : String,
    data : String,
});

const Post = mongoose.model("posts",postSchema);

app.get("/",(req,res) => {
    Post.find()
    .then((foundPost) => {
        res.render("home",{
            homeStartingContent : homeStartingContent,
            postContent : foundPost
        });
    })
    .catch((err) => {
        console.log(err);
    }); 
});

app.get("/about",(req,res) => {
    res.render("about",{
        aboutContent : aboutContent
    });
});

app.get("/contact",(req,res) => {
    res.render("contact",{
        contactContent : contactContent
    });
});

app.get("/compose",(req,res) => {
    res.render("compose");
});

app.get("/posts/:postName",(req,res) => {
    Post.findOne({name : req.params.postName})
    .then((post) => {
        res.render("post",{
            postTitle : post.name,
            postData : post.data
        });
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post("/compose",(req,res) => {
    const postTitle = req.body.formTitle;
    const postData = req.body.formPost;

    const newPost = new Post({
        name : postTitle,
        data : postData
    });

    newPost.save();

    res.redirect("/");
});

app.post("/delete",(req,res) => {
    const postId = req.body.postDelete;
    Post.deleteOne({_id : postId})
    .then(() => {
        console.log("Post deleted!!");
        res.redirect("/");
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post("/update",(req,res) => {
    const postId = req.body.postUpdate;
    Post.findOne({_id : postId})
    .then((post) => {
        res.render("postUpdate",{
            newTitle : post.name,
            newPost : post.data
        });
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post("/updatedPost",(req,res) => {
    Post.updateOne({name : req.body.postTitle}, {data : req.body.postPost})
    .then(() => {
        console.log("Post Updated successfully");
    })
    .catch((err) => {
        console.log(err);
    });
    res.redirect("/");
});

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}

app.listen(port,() => {
    console.log("Server is running successfully!!!");
})