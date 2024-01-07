const express = require("express");
const router = express.Router();
const { User } = require("../model/user");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const nodemailer = require('nodemailer');
const authAdmin = require("../middleware/auth-admin");
const authEmployee = require("../middleware/auth-employee");
require('dotenv').config();

router.get("/getUser", (req, res) => {
  // 200
  return res.status(200).send({ message: "Get Reqeust for user", data: "user get successfully" });
});


// user created by only admin
router.post("/createNewUser", authAdmin, async (req, res) => {
  // check its admin or not
  // check token is verified and valid
  // if invlid user 
  const { error, value } = signUpValidationSchema().validate(req.body);
  if (error) return res.status(400).send({ massage: "Bad Request", error: error.details });
  try {
    let user = await User.findOne({ email: req.body.email, employeeId: req.body.employeeId });
    if (user) return res.status(400).send({ message: "Bad Request", data: "user is already exist" });
    // 200
    user = new User({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      role: value.role,
      enabled: true,
      employeeId: value.employeeId,
      createdBy: req.user._id
    });

    const password = randomString.generate(10);
    // const password = "12345678";
    console.log("password", password);
    const salt = await bcrypt.genSalt(10);
    user.password = bcrypt.hashSync(password, salt);

    user = await user.save();

    // send password to employee on email using  nodemailer

    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: "", // sender email id ( abc@gmail.com )
      to: "", // receiver email id ( xyz@gmail.com )
      subject: "Nodemailer email send module",
      text: `Hi, Welcome to meal booking your password is ${password}`
    }

    transport.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      }
    });
    // nodemailer code end

    return res.status(200).send({ message: "User has been created.", data: user });
  } catch (error) {
    console.log("error in sign up", error);
    return res.status(500).send({ message: "Something went wrong", data: "server not working" });
  }
});

router.patch("/activateDeactiveUser", authAdmin, async (req, res) => {
  try {
    const { error, value } = activateDeactiveValidationSchema().validate(req.body);
    if (error) return res.status(400).send({ massage: "Bad Request", error: error.details });
    let user = await User.findOne({ _id: value.userId }).select('-password');
    if (!user) return res.status(400).send({ message: "Bad Request", data: "user not found" });
    user.enabled = value.enabled;
    user.updatedBy = req.user._id;
    user.updatedAt = new Date();
    await user.save();
    return res.status(200).send({ message: "User status updated", data: user });
  } catch (error) {
    console.log("error in sign up", error);
    return res.status(500).send({ message: "Something went wrong", data: "server not working" });
  }
});


// admin login only 
router.post("/adminLogin", async (req, res) => {
  console.log(req.body)
  const { error, value } = signInValidationSchema().validate(req.body);
  if (error) return res.status(400).send({ massage: "Bad Request", error: error.details });
  try {
    // check user is exist in our platform 
    let user = await User.findOne({ email: value.userName });
    // check user is not found
    if (!user) return res.status(400).send({ message: "Bad Request", data: "user is not exist." });
    // check its enabled or not
    if (!user.enabled) return res.status(400).send({ message: "Bad Request", data: "User has been disabled. Please contact admin." });
    if (user.role != "admin") return res.status(400).send({ message: "Bad Request", data: "You are not admin." });
    // if(!user.isEmailVeirfied) return res.status(400).send({ message : "Bad Request" , data : "Please verify your email. Please contact admin." });
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ message: "Bad Request", data: "Invalid password." });
    const token = generateAuthToken(user);
    return res.status(200).send({ message: "Admin Login successfully.", data: token, role: user.role });
  } catch (error) {
    console.log("error in sign up", error);
    return res.status(500).send({ message: "Something went wrong", data: "server not working" });
  }
});


router.post("/employeeLogin", async (req, res) => {
  console.log(req.body)

  const { error, value } = signInValidationSchema().validate(req.body);
  if (error) return res.status(400).send({ massage: "Bad Request", error: error.details });
  try {
    // check user is exist in our platform 
    let user = await User.findOne({ email: value.userName });
    // check user is not found
    if (!user) return res.status(400).send({ message: "Bad Request", data: "user is not exist." });
    // check its enabled or not
    if (!user.enabled) return res.status(400).send({ message: "Bad Request", data: "User has been disabled. Please contact admin." });
    if (user.role != "employee") return res.status(400).send({ message: "Bad Request", data: "You are not employee." });
    // if(!user.isEmailVeirfied) return res.status(400).send({ message : "Bad Request" , data : "Please verify your email. Please contact admin." });
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ message: "Bad Request", data: "Invalid password." });
    const token = generateAuthToken(user);
    return res.status(200).send({ message: "Employee Login successfully.", data: token, role: user.role });
  } catch (error) {
    console.log("error in sign up", error);
    return res.status(500).send({ message: "Something went wrong", data: "server not working" });
  }
});

// update profile employee
router.patch("/updateMyProfile", authEmployee, async (req, res) => {
  try {
    const { error, value } = updateEmployeeProfileValidationSchema().validate(req.body);
    if (error) return res.status(400).send({ massage: "Bad Request", error: error.details });
    let user = await User.findOne({ _id: req.user._id }).select('-password');
    user.firstName = value.firstName;
    user.lastName = value.lastName;
    user.updatedBy = req.user._id;
    user.save();
    return res.status(200).send({ message: "Your profile has been updated successfully.", user: user });
  } catch (error) {
    console.log("error in sign up", error);
    return res.status(500).send({ message: "Something went wrong", data: "server not working" });
  }
});

// for employee code
router.get("/getMyProfile", authEmployee, async (req, res) => {
  try {
    return res.status(200).send({ message: "Your profile has been get successfully.", user: req.user });
  } catch (error) {
    console.log("error in sign up", error);
    return res.status(500).send({ message: "Something went wrong", data: "server not working" });
  }
});

const generateAuthToken = (user) => {
  const token = jwt.sign({ _id: user._id, firstName: user.firstName }, process.env.JWT_TOKEN_SECRET, { expiresIn: "10d" }, { algorithm: "RS256" });
  return token;
}

const signUpValidationSchema = () => {
  const schema = Joi.object({
    firstName: Joi.string().required().min(2).max(50).trim().label("First Name"),
    lastName: Joi.string().required().min(2).max(50).trim().label("Last Name"),
    role: Joi.string().required().min(2).max(50).trim().label("Role"),
    email: Joi.string().email().required().lowercase().label("Email ID"),
    employeeId: Joi.string().required().min(2).max(15).trim().label("Employee ID"),
  });

  return schema;
}


const signInValidationSchema = () => {
  const schema = Joi.object({
    userName: Joi.string().email().required().lowercase().label("User Name"),
    password: Joi.string().required().min(8).max(15).trim().label("Password")
  });

  return schema;
}

const updateEmployeeProfileValidationSchema = () => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).trim().label("First Name"),
    lastName: Joi.string().min(2).max(50).trim().label("Last Name"),
  });
  return schema;
}

const activateDeactiveValidationSchema = () => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    enabled: Joi.boolean().required(),
  });
  return schema;
}


module.exports = router;


// // sign up
// // meal book
// // meal cancel
// // meal coupon activate
// // payment \
// // profile ( 50 , 100 )


// // admin ( activate / deactive user)  =----> employee token API use XXXX

