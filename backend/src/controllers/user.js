const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashPassword;

    const emailExist = await User.exists({ email: req.body.email });

    if (emailExist) {
      return res.status(409).json({ msg: "Email exists" });
    }

    await User.create(req.body);
    return res.status(201).json({ msg: "User register successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error registering user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const isMatched = await bcrypt.compare(req.body.password, user.password);
      if (isMatched) {
        const token = jwt.sign(
          { email: req.body.email },
          process.env.SECRET_KEY
        );
        return res.json({ msg: "Login successful" });
      } else {
        return res.status(401).json({ msg: "Invalid Password" });
      }
    } else {
      return res.status(401).json({ msg: "User not registered" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error logging in", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashPassword;
    await user.save();

    return res.json({ msg: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error resetting password", error: error.message });
  }
};
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, 'username email');
      res.json(users);
    } catch (error) {
      res.status(500).json({ msg: "Error fetching users", error: error.message });
    }
  };
  const updateUser = async (req, res) => {
    const { email, username, newEmail } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        user.username = username;
        user.email = newEmail || email;
        await user.save();

        res.json({ msg: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error updating user", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json({ msg: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error deleting user", error: error.message });
    }
};

module.exports = { registerUser, loginUser, resetPassword, getAllUsers, updateUser, deleteUser };
