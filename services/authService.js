const User = require('../models/User');
const bcrypt = require('bcrypt');

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

  return user;
};
