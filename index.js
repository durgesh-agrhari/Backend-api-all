const express = require("express");
const app = express();

const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const userRouter = require("./routers/Users");
const authRouter = require("./routers/Auth");
const PostRouter = require("./routers/Posts");
const CommentRouter = require("./routers/Comments");

// dotenv.config();
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MongoDb is connected");
});

//middle ware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/socialapp/api/users", userRouter);
app.use("/socialapp/api/auth", authRouter);
app.use("/socialapp/api/post", PostRouter);
app.use("/socialapp/api/comment", CommentRouter);

// app.get("/socialapp/api/users", (req, res) => {
//   res.send("Hello user");
// });

app.listen(8200, () => {
  console.log("App is running port " + 8200);
});
