const express = require("express");
const router = express.Router();
const Post = require("../models/post")
const Comment = require("../models/comment")
const admin = "Admin";
let isAdmin = false;

let currDate = new Date().toLocaleDateString();
//TODO make a new topics form to add topics
const topics = Post.schema.path('topic').enumValues;
const catchAsync = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

const requireAdmin = (req, res, next) => {
    if(req.session.user_id !== admin) {
        req.flash("error", "You are not authorized there, my friend");
        return res.redirect("/");
    }
    next();
}
//put comment here too I think
//people can choose which category to display
router.get('/', catchAsync(async (req, res) => {
    const posts = await Post.find({});
    //console.log(posts);
    if(req.session.user_id === admin) isAdmin = true;
    else isAdmin = false;
    res.render("blogs/index", { posts, isAdmin, topics});
}))

//then a get and post request to create post
router.get('/new', requireAdmin, (req, res) => {
    console.log(topics);
    res.render("blogs/new", { topics });
})

//make a validation function for me
router.post("/", requireAdmin, catchAsync(async (req, res) => {
    req.body.post.date = currDate;
    const post = new Post(req.body.post);
    await post.save();
    console.log(post);
    req.flash("success", "Successfully made a new post!");
    res.redirect(`/blogs/${post._id}`);
}))

//a get request to render detailed post
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("comments");
    if(req.session.user_id === admin) isAdmin = true;
    else isAdmin = false;
    res.render("blogs/detail", { post, isAdmin });
}))

router.get("/:id/edit", requireAdmin, catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.redirect("/blogs");
    }
    res.render("blogs/edit", { post, topics });
}))

router.put("/:id", requireAdmin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    req.flash("success", "Successfully edited a post!");
    res.redirect(`/blogs/${post._id}`);
}))

//a delete request to delete post
router.delete("/:id", requireAdmin, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success", "Successfully delete a post!");
    res.redirect("/blogs");
}))

//comments section
router.post('/:id/comment', catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(req.params.id);
    req.body.comment.date = currDate;
    const comment = new Comment(req.body.comment);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    req.flash("success", "Successfully made a comment!");
    res.redirect(`/blogs/${id}`);
}))

router.delete("/:id/comment/:commentId", requireAdmin, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    //console.log("hit delete route");
    req.flash("success", "Successfully delete a comment!");
    res.redirect(`/blogs/${id}`);
}))

module.exports = router;