const User = require("../model/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "yourpassword",
  },
});

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array()[0]);
    return res.status(400).send(errors.array()[0].msg);
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        if (password === confirmPassword) {
          return bcrypt.hash(password, 12);
        } else {
          throw new Error("Password and Confirm Password should match!");
        }
      } else {
        throw new Error("Email already exists. Please try with another Email!");
      }
    })
    .then((hashedPassword) => {
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      return user.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
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

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email or Passoword does not mathch");
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      res.status(200).send("Logged in successfully!!");
    } else {
      throw new Error("Email or Passoword does not mathch");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.resetPasswordlink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(
        "User with entered email does not exist. Please use registered email"
      );
    }
    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);

    const mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: "Reset Passowrd",
      html: `Dear User,
        Click <a href = "http://localhost:8080/${token}"> here </a> to reset your password!
      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error", error);
      } else {
        console.log(
          "Password Reset Email sent on your registered email Id" +
            info.response
        );
      }
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
