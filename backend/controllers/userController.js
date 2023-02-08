const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcrypt");
const authController = require("./authController");
const minioUtils = require("../utils/minioUtils");
const {convertToBuffer} = require("../services/fileService");
const userController = {
  //GET A USER
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user.fileName){
        user.profilePicture = await minioUtils.getFileUrl(process.env.MINIO_BUCKET_MESSAGE, user.fileName);
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A USER
  deleteUser: async (req, res) => {
    if (req.body.userId === req.params.id) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can only delete your account");
    }
  },

  //UPDATE A USER
  updateUser: async (req, res) => {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      let imageUrl = null;
      if (req.body.fileName){
        let fileBuffer = convertToBuffer(req.body.data);
        imageUrl = await minioUtils.uploadFile( fileBuffer,process.env.MINIO_BUCKET_MESSAGE,req.body.fileName);
      }
      const user = await User.findByIdAndUpdate(
        req.params.id.trim(),
        {
          $set: req.body,
        },
        { returnDocument: "after" }
      ).select("+password");
      const accessToken = await authController.generateAccessToken(user);
      if (imageUrl){
        req.body.profilePicture = imageUrl;
      }
      if (req.body.profilePicture || req.body.theme) {
        try {
          await Post.updateMany(
            { userId: req.params.id },
            {
              $set: { avaUrl: req.body.profilePicture, theme: req.body.theme },
            }
          );
          await Comment.updateMany(
            { ownerId: req.params.id },
            {
              $set: { avaUrl: req.body.profilePicture, theme: req.body.theme },
            }
          );
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      const returnedUser = {
        ...user._doc,
        accessToken: accessToken,
      };
      res.status(200).json(returnedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //FOLLOW A USER
  followUser: async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        //If user not follow yet
        if (!user.followers.includes(req.body.userId)) {
          await User.findByIdAndUpdate(req.params.id, {
            $push: { followers: req.body.userId },
          });
          const updatedUser = await User.findByIdAndUpdate(
            req.body.userId,
            {
              $push: { followings: req.params.id },
            },
            { returnDocument: "after" }
          );
          return res.status(200).json(updatedUser);
        } else {
          await User.findByIdAndUpdate(req.params.id, {
            $pull: { followers: req.body.userId },
          });
          const updateUser = await User.findByIdAndUpdate(
            req.body.userId,
            {
              $pull: { followings: req.params.id },
            },
            { returnDocument: "after" }
          );
          return res.status(200).json(updateUser);
        }
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can't follow yourself");
    }
  },

  //SEARCH FOR USERS
  searchAllUser: async (req, res) => {
    try {
      const username = req.query.username;
      const user = await User.find({ username: { $regex: username } })
        .limit(2)
        .select("username profilePicture theme")
        .exec();
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  //GET LEADER BOARDS
  getLeaderboard: async (req, res) => {
    try {
      const users = await User.find().sort({ karmas: -1 }).limit(10);
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getAllUserWithId: async (req,res)=>{
    try{
      const users = await User.find({
        _id:{$in: req.body.users}
      });
      return res.status(200).json(users);
    }catch (err) {
      return res.status(500).json(err);
    }
  }
};
module.exports = userController;
