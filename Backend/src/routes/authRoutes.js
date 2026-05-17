const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { signup, login, logout, getMe } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getMe);

module.exports = router;