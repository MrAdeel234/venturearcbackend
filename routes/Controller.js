import EntrepreneurModel from "../Models/EntrepreneurModel.js";
import InvestorModel from "../Models/InvestorModel.js";
import Message from "../Models/MessageModel.js";
import upload from "../multer/multer.js";
import jwt from "jsonwebtoken";

// Signup Route
const signup = async (req, res) => {
  const {
    name,
    email,
    username,
    contactNumber,
    country,
    password,
    confirmPassword,
    userType,
  } = req.body;

  const imageUrl = req.file.path;

  console.log(imageUrl);

  // User Type Validation
  if (!userType) {
    return res.status(400).json({ message: "User type is required." });
  }

  // Fields Validation
  if (
    !name ||
    !email ||
    !username ||
    !contactNumber ||
    !country ||
    !password ||
    !confirmPassword
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Password match validation
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  // Model selection based on userType
  let model;
  if (userType === "Entrepreneur") {
    model = EntrepreneurModel;
  } else if (userType === "Investor") {
    model = InvestorModel;
  } else {
    return res.status(400).json({ message: "Invalid user type" });
  }

  // Email Check
  const emailExists = await model.exists({ email });
  if (emailExists) {
    return res
      .status(400)
      .json({ message: "Email already registered with another account" });
  }

  // Username Check
  const usernameExists = await model.exists({ username });
  if (usernameExists) {
    return res
      .status(400)
      .json({ message: "Username already registered with another account" });
  }

  // Save profile picture URL
  const profilePicture = req.file ? req.file.path : null;

  try {
    const newUser = new model({
      name,
      email,
      username,
      contactNumber,
      country,
      profilePicture: imageUrl,
      password,
    });

    await newUser.save();
    console.log(`${userType} saved successfully`);
    return res.status(201).json({
      message: `${userType} saved successfully`,
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Login Route
const login = async (req, res) => {
  const { email, password, userType } = req.body;
  console.log(email, password, userType);

  // User Type Validation
  if (!userType) {
    return res
      .status(400)
      .json({ status: "failed", message: "User type is required." });
  }

  // Fields Validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "failed", message: "All fields are required." });
  }

  // Model selection based on userType
  let model;
  if (userType === "Entrepreneur") {
    model = EntrepreneurModel;
  } else if (userType === "Investor") {
    model = InvestorModel;
  } else {
    return res
      .status(400)
      .json({ status: "failed", message: "Invalid user type" });
  }
  console.log(model);

  try {
    let user;
    if (userType === "Entrepreneur") {
      user = await model.findOne({ email: email }).populate("Ideas");
    } else if (userType === "Investor") {
      user = await model.findOne({ email: email });
    }
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .send({ status: "failed", message: "User does not exists" });
    }
    if (password !== user.password) {
      return res
        .status(400)
        .send({ status: "failed", message: "Password is incorrect" });
    }

    return res.status(200).send({
      status: "success",
      message: "User Found",
      user: { ...user.toObject(), userType },
    });
  } catch (error) {
    console.log("Hello 4");
    return res.status(500).send({ status: "failed", message: "Server Error" });
  }
};

// Get Chat Users
const getChatUsers = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find unique users who have chatted with the current user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).lean();

    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.sender.toString() !== userId) userIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId)
        userIds.add(msg.receiver.toString());
    });
    console.log("This is userIds");
    console.log(userIds);

    // Fetch entrepreneurs
    const entrepreneurs = await EntrepreneurModel.find({
      _id: { $in: [...userIds] },
    })
      .select("_id name profilePicture")
      .lean();

    // Fetch investors
    const investors = await InvestorModel.find({ _id: { $in: [...userIds] } })
      .select("_id name profilePicture")
      .lean();

    // Manually add userType
    const formattedEntrepreneurs = entrepreneurs.map((user) => ({
      ...user,
      userType: "Entrepreneur",
    }));
    const formattedInvestors = investors.map((user) => ({
      ...user,
      userType: "Investor",
    }));

    // Merge both lists
    const users = [...formattedEntrepreneurs, ...formattedInvestors];

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { signup, login, getChatUsers };
