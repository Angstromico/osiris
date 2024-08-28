require('dotenv').config();
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { connectToMongoose } = require('../src/config/db');
const trabajadorController = require('./controllers/trabajadorController');
const companyController = require('./controllers/CompanyController'); 
const cargoEmpresaController = require('./controllers/cargoEmpresaController'); 
const areaEmpresaController = require('./controllers/areaEmpresaController'); 
const isoController = require('./controllers/isoController'); 
const companyEconomicActivityController = require('./controllers/companyEconomicActivity.controller'); 
const userController = require('./controllers/userController');
const sedeController = require('./controllers/sedeController');
const paisController = require('./controllers/paisController');
const personaController = require('./controllers/personaController');
const authController = require('./controllers/authController');
const userProfileController = require('./controllers/userProfileController');
const extintorController = require('./controllers/extintorEmpresaController')

const port = process.env.PORT || 3000;

const app = express();

// Conecta a la base de datos
connectToMongoose();

app.use(express.json()); 
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(cors());

// Configurar la estrategia OAuth2
passport.use(
  'oauth2',
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
    res.redirect('/dashboard');
  }
);

app.use(errorHandler);

// Routes
app.use('/auth/provider', passport.authenticate('oauth2'));
app.use('/auth', authController);
app.use('/company', companyController); 
app.use('/cargo', cargoEmpresaController); 
app.use('/area', areaEmpresaController); 
app.use('/iso', isoController); 
app.use('/companyEconomicActivity', companyEconomicActivityController); 
app.use('/user', userController);
app.use('/sede', sedeController);
app.use('/persona', personaController);
app.use('/pais', paisController);
app.use('/profile', userProfileController);
app.use('/extintor', extintorController);

// Rutas de trabajador (montadas correctamente bajo /api)
app.post('/api/trabajador', trabajadorController.createTrabajador);
app.get('/api/trabajador/:id', trabajadorController.getTrabajadorById);
app.get('/api/trabajadores', trabajadorController.getAllTrabajadores);
app.put('/api/trabajador/:id', trabajadorController.updateTrabajador);
app.delete('/api/trabajador/:id', trabajadorController.deleteTrabajador);

app.get('/', (req, res) => res.send('Iso Main!'));

app.use((err, req, res, next) => {
  console.error(err.stack); // Log errors
  res.status(err.status || 500).json({ message: 'Internal Server Error' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
