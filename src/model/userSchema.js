const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }]
});

// Middleware to encrypt the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// Method to validate the password
userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
}

// Method to validate the email
userSchema.methods.isEmailValid = function(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Method to assign a role to the user
userSchema.methods.assignRole = async function(roleId) {
  if (!this.roles.includes(roleId)) {
    this.roles.push(roleId);
    await this.save();
  }
  return this;
};

// Method to check if the user has a specific role
userSchema.methods.hasRole = async function(roleName) {
  await this.populate('roles').execPopulate();
  return this.roles.some(role => role.name === roleName);
};

// Method to remove a role from the user
userSchema.methods.removeRole = async function(roleId) {
  this.roles = this.roles.filter(role => !role.equals(roleId));
  await this.save();
  return this;
};

// Method to get all roles of the user
userSchema.methods.getRoles = async function() {
  await this.populate('roles').execPopulate();
  return this.roles;
};


module.exports = mongoose.model('User', userSchema);
