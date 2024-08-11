const Users = require("../modals/User");

const router = require("express").Router();
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req, res) => {
  const newUser = new Users({
    fullname: req.body.fullname,
    username: req.body.username,
    emailId: req.body.emailId,
    mobile: req.body.mobile,
    password: req.body.password,
  });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new Users({
      fullname: req.body.fullname,
      username: req.body.username,
      emailId: req.body.emailId,
      mobile: req.body.mobile,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ emailId: req.body.emailId });
    !Users && res.status(200).json({ status: false, message: "user not fond" });
    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        res.status(200).json({
          status: true,
          message: "User login Sucessfuly",
          data: user,
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Wrong password",
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
