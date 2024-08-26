const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../model/userSchema');
const Role = require('../model/roleSchema');


const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Get the default "user" role if no roles are specified
    const defaultRole = await Role.findOne({ name: 'user' });
    if (!defaultRole) {
      return res.status(500).json({ message: 'Default role not found' });
    }

    // Create the new user
    const newUser = new User({
      email,
      password,
      roles: [defaultRole._id]
    });

    await newUser.save();
    console.log(`New user inserted with ID: ${newUser._id}`);
    res.status(201).json({ message: 'User created successfully', id: newUser._id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validación del ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Buscar el usuario y poblar los roles
    const user = await User.findById(userId).populate('roles');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const users = await User.find({ email });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: err.message || 'Error al realizar la búsqueda' });
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    // Validación del ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Validación de entrada
    if (!updatedUser || Object.keys(updatedUser).length === 0) {
      return res.status(400).json({ message: 'No data provided to update' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedUser },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validación del ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  getUserById,
  getEmail,
  getAllUser,
  updateUser,
  deleteUser,
};
