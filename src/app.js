const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const bodyParser = require('body-parser');
const cors = require('cors');

//const auth = passport.authenticate('jwt', { session: false });
const errorHandler = require('./middlewares/errorHandler');
const companyController = require('./controllers/companyController'); 
const cargoEmpresaController = require('./controllers/cargoEmpresaController'); 
const areaEmpresaController = require('./controllers/areaEmpresaController'); 
const isoController = require('./controllers/isoController'); 
const companyEconomicActivityController = require('./controllers/companyEconomicActivity.controller'); 
const userController = require('./controllers/userController');
const sedeController = require('./controllers/sedeController');
const paisController = require('./controllers/paisController');
const personaController = require('./controllers/personaController');



const app = express();
app.use(express.json()); 
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());

const port = process.env.PORT || 3000;

// Conectar a MongoDB
const mongoURI = process.env.URI || 'mongodb://127.0.0.1:27017/isodb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log('Connected to the database');

  // Crear esquema y modelo de ejemplo
  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  });

  const User = mongoose.model('User', userSchema);

/*
/*
// Esta sección de código inserta usuarios iniciales si no existen.
// Se elimina porque la lógica de inserción de datos iniciales puede ser innecesaria
// Se crea un archivo en raiz para insertar datos llamado initializeDatabase.js
// se manda llamar con comando  npm run init-db
// En json se creo   "init-db": "node initializeDatabase.js", para poder ejecutarlo
  // Insertar datos iniciales si no existen
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.insertMany([
        { name: 'John Doe', email: 'john@example.com', password: '123456' },
        { name: 'Jane Doe', email: 'jane@example.com', password: '123456' }
      ]);
      console.log('Initial data inserted');
    }
  } catch (err) {
    console.error(err);
  }*/
}); 

// Configurar estrategia de autenticación OAuth2
passport.use(
  'login',
  new OAuth2Strategy({
    authorizationURL: process.env.AUTHORIZATION_URL,
    tokenURL: process.env.TOKEN_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  })
);

app.get('/auth/callback', 
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.use(errorHandler);

// Definición de rutas
app.use('/auth/provider', passport.authenticate('oauth2'));
app.use('/company', companyController); 
app.use('/cargo', cargoEmpresaController); 
app.use('/area', areaEmpresaController); 
app.use('/iso', isoController); 
app.use('/companyEconomicActivity', companyEconomicActivityController); 
app.use('/user', userController);
app.use('/sede', sedeController);
app.use('/persona', personaController);
app.use('/pais', paisController);

app.get('/', (req, res) => res.send('Iso Main!'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
