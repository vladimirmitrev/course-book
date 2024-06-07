const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jsonwebtoken');
const SECRET = 'cas7dav78d8vasd9va9sdv9asdv89vad8da';

exports.register = async (userData) => {
  if (userData.password !== userData.rePassword) {
    throw new Error('Password mismatch!');
  }

  const user = await User.findOne({ email: userData.email });
  if (user) {
    throw new Error('Email already taken!');
  }

  return User.create(userData);
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password!');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password!');
  }

  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  }

  const token = await jwt.sign(payload, SECRET, {expiresIn: '2h'});

  return token;
};
