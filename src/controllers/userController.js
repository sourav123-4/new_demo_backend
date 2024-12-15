const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({ _id: user.id, name: user.name, email: user.email });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadFile = async (req,res)=>{
  try {
    const inputPath = req.file.path;
    const outputPath = `uploads/converted-${Date.now()}.mp3`;
  
    ffmpeg(inputPath)
      .audioFilters('asetrate=22050*0.9,aresample=22050,atempo=1.2') // Changes pitch and tempo
      .save(outputPath)
      .on('end', () => {
        res.json({ convertedAudioUrl: `http://your-backend-url.com/${outputPath}` });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Audio conversion failed', details: err.message });
      });
  } catch (error) {
    
  }
}

module.exports = { registerUser, loginUser, getUserProfile };
