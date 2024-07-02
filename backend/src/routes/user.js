const express = require("express");
const router = express.Router();

const { registerUser, loginUser, resetPassword, getAllUsers, updateUser, deleteUser } = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/reset-password", resetPassword);
router.get("/", getAllUsers);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

module.exports = router;