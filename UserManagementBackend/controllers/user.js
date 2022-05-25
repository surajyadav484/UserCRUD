const User = require("../model/user");
const mongoose = require("mongoose");

exports.getUser = (req, res, next) => {
  User.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.postUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const user = new User({
    name,
    email,
    password,
    confirmPassword,
  });
  user
    .save()
    .then((result) => {
      res.json("user added successfully");
    })
    .catch((err) => console.log(err));
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(404).json({ err });
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User does not exists");
    }
    console.log(req.body);
    const { name, email, password, confirmPassword } = req.body;
    const updatedUser = await User.updateOne(
      { _id: userId },
      { name, email, password, confirmPassword }
    );
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await User.deleteOne({ _id: userId });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};
