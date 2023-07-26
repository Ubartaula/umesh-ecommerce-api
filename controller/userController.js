const nodemailer = require("nodemailer");
const User = require("../model/User");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  const users = await User.find().select("-password").lean().exec();
  if (!users.length)
    return res.status(400).json({ message: "no users data found " });

  res.json(users);
};

const addUser = async (req, res) => {
  const { username, email, password, roles, longitude, latitude } = req.body;

  if (!username || !email || !password || !longitude || !latitude)
    return res.status(400).json({ message: " need all information" });

  if (password.length < 4) {
    return res
      .status(400)
      .json({ message: "Minimum length for password require 4 character" });
  }

  const checkDuplicateEmail = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (checkDuplicateEmail)
    return res.status(409).json({ message: "user email already exist" });

  const hashPassword = await bcrypt.hash(password, 10);

  const newUserObj = roles
    ? {
        username,
        email,
        password: hashPassword,
        roles,
        longitude,
        latitude,
      }
    : {
        username,
        email,
        password: hashPassword,
        longitude,
        latitude,
      };

  if (newUserObj) {
    await User.create(newUserObj);
    res.json({ message: "a new user created" });
  } else {
    res.status(400).json({ message: "error at creating new user obj" });
  }
};

const editUser = async (req, res) => {
  const { id, username, email, password, roles, active } = req.body;
  if (!id) return res.status(400).json({ message: "id require to edit user" });

  const findUserToEdit = await User.findById(id).exec();
  if (!findUserToEdit)
    return res.status(400).json({ message: "no such user found to edit" });

  const checkDuplicateEmail = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (checkDuplicateEmail && checkDuplicateEmail._id.toString() !== id)
    return res.status(409).json({ message: "user email already exist" });

  if (username) {
    findUserToEdit.username = username;
  }
  if (email) {
    findUserToEdit.email = email;
  }
  if (password) {
    if (password?.length <= 4)
      return res
        .status(400)
        .json({ message: "password minimum length require 4 character" });
    const hashPassword = await bcrypt.hash(password, 10);
    findUserToEdit.password = hashPassword;
  }

  if (roles) {
    findUserToEdit.roles = roles;
  }
  if (active) {
    findUserToEdit.active = active;
  }

  await findUserToEdit.save();
  res.json({ message: `a user with id ${id} has edited` });
};

const patchUser = async (req, res) => {
  const { email, otp, otpExpire } = req.body;
  if (!email || !otp || !otpExpire)
    return res.status(400).json({ message: "email otp, otpExpire needed" });

  const findUserToPatch = await User.findOne({ email });
  if (!findUserToPatch)
    return res
      .status(400)
      .json({ message: "Sorry, we don't recognize that email address " });

  findUserToPatch.otp = otp;
  findUserToPatch.otpExpire = otpExpire;
  await findUserToPatch.save();

  // nodemailer
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.emailUser,
      pass: process.env.emailPass, // this password is not the one for your email login.
      // this password needs to generate as app password,
      // which you can do after you click 2 way password verification
    },
  });

  const mailOption = {
    from: process.env.emailUser,
    to: email,
    subject: "password reset opt",
    text: `Your reset password code is ${otp} and expires in 5 minute`,
  };

  transport.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("otp sent" + info.response);
    }
  });

  res.json({ message: "password reset code generated" });
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: "id require to delete a user" });

  const findUserToDelete = await User.findById(id).exec();
  if (!findUserToDelete)
    return res.status(400).json({ message: "no such user found to delete" });

  await findUserToDelete.deleteOne();
  res.json({ message: `a user with id ${id} has deleted` });
};

module.exports = { getUsers, addUser, editUser, deleteUser, patchUser };
