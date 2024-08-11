const router = require("express").Router();
const { json } = require("express");
const Post = require("../modals/Post");
const { route } = require("./Users");

//for file upload
const upload = require("../middleware/Upload");

// add post withs for file
router.post("/addf", upload.single("imageurl"), async (req, res) => {
  try {
    const newPost = new Post(req.body);
    //for file url
    if (req.file) {
      newPost.imageurl = req.file.filename;
    }
    newPost
      .save()
      .then(() => {
        res
          .status(200)
          .json({ status: true, message: "Post added sucessfully" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

// add post
router.post("/add", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    newPost
      .save()
      .then(() => {
        res
          .status(200)
          .json({ status: true, message: "Post added sucessfully" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

// update post
router.put("/updatePost/:id", async (req, res) => {
  try {
    Post.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
      .then(() => {
        res.status(200).json({
          status: true,
          message: "Post updated data sucessfully",
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post

router.delete("/deletePost/:id", async (req, res) => {
  try {
    const user = await Post.findOne({ _id: req.params.id });
    if (user) {
      Post.findByIdAndDelete({ _id: req.params.id }).then(() => {
        res
          .status(200)
          .json({ status: true, messsage: "Post deleted sucessfuly" });
      });
    } else {
      res
        .status(200)
        .json({ status: false, message: "Post not found in this id" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get post details by id

router.get("/getPost/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    post &&
      res.status(200).json({
        status: true,
        message: "Post data fatched sucessfully",
        data: post,
      });
    !post &&
      res.status(200).json({
        status: false,
        message: "Post data not found",
        data: post,
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all posts

router.get("/getallPosts", async (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        status: true,
        message: "all Posts fatched sucessfully",
        data: posts,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// get all posts of any users by id

router.get("/getFrienddata/:id", async (req, res) => {
  try {
    Post.find({ userId: req.params.id })
      .then((posts) => {
        res.status(200).json({
          status: true,
          message: "all Posts fatched sucessfully",
          data: posts,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//like post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    let isLiked = false;
    post.likes.map((item) => {
      if ((item = req.body.userId)) {
        isLiked = true;
      }
    });
    if (isLiked) {
      const res1 = await Post.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.body.userId } }
      );
      res.status(200).json({
        satatus: true,
        message: "like removed sucessfully",
      });
    } else {
      const res1 = await Post.updateOne(
        { _id: req.params.id },
        { $push: { likes: req.body.userId } }
      );
      res.status(200).json({
        satatus: true,
        message: "post liked sucessfully",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//comment post

module.exports = router;
