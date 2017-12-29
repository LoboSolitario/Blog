var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
//APP CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/blog_data", { useMongoClient: true });
app.use(methodOverride("_method"));

//MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    name: String,
    image: String,
    author: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);
mongoose.Promise = global.Promise;



//ROUTES


app.get("/", function(req, res) {
    res.redirect("/blogs");
});


//INDEX ROUTE


app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err)
            console.log(err);
        else {
            res.render("index", { blogs: blogs });
        }

    });
});


//NEW ROUTE


app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, blog) {
        if (err)
            res.redirect("/new");
        else
            res.redirect("/blogs");
    });
});


//NEW FORM ROUTE


app.get("/blogs/new", function(req, res) {
    res.render("new");
});


//SHOW ROUTE


app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", { blog: foundBlog });
        }
    });
});


//EDIT ROUTE


app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", { blog: blog });
        }
    });
});


//UPDATE ROUTE


app.put("/blogs/:id",function(req,res){
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
       if(err)
            res.redirect("/blogs");
        else
        {
            res.redirect("/blogs/"+blog._id);
        }
   }) ;
});


//DELETE ROUTE

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    }); 
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started");
});
