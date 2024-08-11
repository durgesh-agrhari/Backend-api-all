const Comment = require("../modals/Comment");
const Post = require("../modals/Post");

const router = require("express").Router();

//add comment
router.post("/addComment", async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      userId: req.body.userId,
      postId: req.body.postId,
      username: req.body.username,
      userProfilePick: req.body.userProfilePick,
    });
    await newComment.save();
    res
      .status(200)
      .json({ status: true, message: "Comment added sucessfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//add comment
router.post("/addComment/:postId", async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      userId: req.body.userId,
      postId: req.body.postId,
      username: req.body.username,
      userProfilePick: req.body.userProfilePick,
    });
    await newComment.save();

    const addComment = await Post.updateOne(
      { _id: req.params.postId },
      {
        $push: { comments: req.body },
      }
    );
    // res.status(200).send(addComment);

    res
      .status(200)
      .json({ status: true, message: "Comment added sucessfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete comment
router.delete("/daleteComment/:id", async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    if (comment) {
      Comment.findOneAndDelete({ _id: req.params.id })
        .then(() => {
          res
            .status(200)
            .json({ status: true, message: "Comment deleted sucessfully" });
        })
        .catch((err) => {
          res.status(201).json(err);
        });
    } else {
      res.status(201).json({ status: flase, message: "Comment not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all comment by post id
router.get("/allComment/:id", async (req, res) => {
  try {
    Comment.find({ postId: req.params.id })
      .then((comments) => {
        res.status(200).json({
          status: true,
          message: "all comments fatched sucessfully",
          data: comments,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update comment

router.put("/updateComment", async (req, res) => {
  try {
    Comment.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
      .then(() => {
        res.status(200).json({
          status: true,
          message: "Comment updated sucessfully",
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
