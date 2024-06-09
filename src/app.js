const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const port = process.env.PORT || 3000;
// const pool = require('./config/db');

// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//         console.error('Error connecting to the database', err.stack);
//     } else {
//         console.log('Connected to the database:', res.rows[0]);
//     }
// });

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// OAuth2 Strategy
passport.use(new OAuth2Strategy({
    authorizationURL: process.env.AUTHORIZATION_URL,
    tokenURL: process.env.TOKEN_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, cb) {
    // Here you would typically fetch user information from the database
    return cb(null, profile);
}));

// Routes
app.use('/auth/provider', passport.authenticate('oauth2'));

app.get('/auth/callback', 
    passport.authenticate('oauth2', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication
        res.redirect('/');
    });

app.use('/users', userRoutes);

// Default route
app.get('/', (req, res) => res.send('Pipeline Test!'));

// Error handling middleware
app.use(errorHandler);


app.listen(port, '0.0.0.0', () => {
    console.log(`App running on http://0.0.0.0:${port}`);
})

module.exports = app;
