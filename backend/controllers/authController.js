const dataa = require("../models/userModel");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email == null || password == null) {
      return res.status(400).json({
        error: "missing or invalid input",
      });
    }
    const userData = await dataa.getUserByEmail(email);
    if (!userData) {
      //user isn't registered yet
      const hash = await bcrypt.hash(password, saltRounds);
      const data = await dataa.signup(email, hash);
      if (data) {
        return res.status(201).json({
          success: "Registered",
        });
      } else {
        return res.status(500).json({
          error: "db connection fail",
        });
      }
    } else {
      return res.status(409).json({
        error: "email already exists",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await dataa.getUserByEmail(email); //this is much better than getting datas from all the users
    if (!userData) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }
    const match = await bcrypt.compare(password, userData.password); //check if the password matches
    if (match) {
      const accessToken = jwt.sign(
        { id: userData.user_id },
        process.env.ACCESS_TOKEN_SECRET,
      ); //payload
      res.status(200).json({
        accessToken: accessToken,
        message: "login successfull",
      });
    } else {
      res.status(400).json({
        error: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
