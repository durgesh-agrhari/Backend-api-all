const User = require("../modals/User");

const router = require("express").Router();

//for demo
// router.get("/", (req, res) => {
//   res.send("Hello user router");
// });

// update

router.put("/update/:id", async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
      .then(() => {
        res.status(200).json({
          status: true,
          message: "updated data sucessfully",
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete User

router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      User.findByIdAndDelete({ _id: req.params.id }).then(() => {
        res
          .status(200)
          .json({ status: true, messsage: "User deleted sucessfuly" });
      });
    } else {
      res
        .status(200)
        .json({ status: false, message: "User not found in this id" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all User
router.get("/getallUser", async (req, res) => {
  User.find()
    .then((user) => {
      res.status(200).json({
        status: true,
        message: "all user fatched sucessfully",
        data: user,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//get one user by id
router.get("/getuser/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    user &&
      res.status(200).json({
        status: true,
        message: "User data fatched sucessfully",
        data: user,
      });
    !user &&
      res.status(200).json({
        status: false,
        message: "User data not found",
        data: user,
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow bothe working follow and unfollow
router.put("/follow/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const currentUser = await User.findOne({ _id: req.body.userId });

    let isFollowed = false;
    user.followers.map((item) => {
      if (item == req.body.userId) {
        isFollowed = true;
      }
    });

    if (isFollowed) {
      const res1 = await User.updateOne(
        { _id: req.params.id },
        { $pull: { followers: req.body.userId } }
      );

      const res2 = await User.updateOne(
        { _id: req.body.userId },
        { $pull: { following: req.params.id } }
      );
      res.status(200).json({
        satatus: false,
        message: "user unfollowed sucessfully",
      });
    } else {
      const res1 = await User.updateOne(
        { _id: req.params.id },
        { $push: { followers: req.body.userId } }
      );

      const res2 = await User.updateOne(
        { _id: req.body.userId },
        { $push: { following: req.params.id } }
      );
      res.status(200).json({
        satatus: true,
        message: "followed user sucessfully",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//unfollow working
router.put("/unfollow/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const currentUser = await User.findOne({ _id: req.body.userId });

    let isFollowed = false;
    user.followers.map((item) => {
      if (item == req.body.userId) {
        isFollowed: true;
      }
    });

    if (!isFollowed) {
      res.status(200).json({
        satatus: false,
        message: "following user sucessfully",
      });
    } else {
      const res1 = await User.updateOne(
        { _id: req.params.id },
        { $pull: { followers: req.body.userId } }
      );

      const res2 = await User.updateOne(
        { _id: req.body.userId },
        { $pull: { following: req.params.id } }
      );
      res.status(200).json({
        satatus: true,
        message: "unfolowed user sucessfully",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
