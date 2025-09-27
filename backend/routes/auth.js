const express = require('express');                   // 1
const router = express.Router();                      // 2
const User = require('../models/user');               // 3
const bcrypt = require('bcrypt');                     // 4
const jwt = require('jsonwebtoken');                  // 5
require('dotenv').config();                           // 6

// Register
router.post('/register', async (req, res) => {        // 7
  const { username, password } = req.body;            // 8
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' }); // 9
  const exists = await User.findOne({ username });    // 10
  if (exists) return res.status(400).json({ message: 'User exists' }); // 11
  const hashed = await bcrypt.hash(password, 10);     // 12
  const user = new User({ username, password: hashed }); // 13
  await user.save();                                  // 14
  const token = jwt.sign({ username }, process.env.JWT_SECRET); // 15
  res.json({ token, username });                      // 16
});

// Login
router.post('/login', async (req, res) => {           // 17
  const { username, password } = req.body;            // 18
  const user = await User.findOne({ username });      // 19
  if (!user) return res.status(400).json({ message: 'Invalid credentials' }); // 20
  const ok = await bcrypt.compare(password, user.password); // 21
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' }); // 22
  const token = jwt.sign({ username }, process.env.JWT_SECRET); // 23
  res.json({ token, username });                      // 24
});

module.exports = router;                              // 25
