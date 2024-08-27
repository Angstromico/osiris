const passport = require("passport");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require('../model/userSchema');


const loginLocal = async (req, res) => {
  passport.use(
    'oauth2',
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // Find the user by email
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          // Compare the password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, user);
        } catch (error) {
          console.error("Error fetching user:", error);
          return done(error);
        }
      }
    )
  );
}



// Conveyor Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (token, correo) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: correo,
    subject: "Login Token for Your Account",
    html: `
      <p>Click the link below to access your account:</p>
      <a href="http://your-app-domain/login?token=${token}">Login Link</a>
      <p>This token is valid for 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


const getTokenJwt = async (req, res) => {
  try {
    const { _id, email } = req.body;

    // Input validation
    if (!_id || !email) {
      return res.status(400).json({ message: 'ID and email are required' });
    }

    const payload = { _id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log(token);
    res.status(200).json({ token });

    // Call sendEmail with the necessary parameters
    await sendEmail(token, email);
  } catch (error) {
    console.error("Error generating JWT:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const loginOther = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate the JWT token
    const token = await getTokenJwt({ body: { _id: user._id, email: user.email } }, res);
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




const receipJwt = async (req, res) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(req.body);
  })(req, res);
};


const generateToken = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate email and password format
    if (!user.isEmailValid(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!(await user.isValidPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate the payload and token
    const payload = { _id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  generateToken,
  sendEmail,
  loginOther,
  receipJwt,
  loginLocal,
  getTokenJwt
};
