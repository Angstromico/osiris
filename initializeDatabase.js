const mongoose = require('mongoose');
const faker = require('faker'); // Asegúrate de instalar faker: npm install faker

const mongoURI = process.env.URI || 'mongodb://127.0.0.1:27017/isoDb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log('Connected to the database');

  // Definir esquemas y modelos
  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

  const companySchema = new mongoose.Schema({
    vNumDocumento: { type: String, unique: true },
    vNombre: { type: String, required: true },
    vDireccion: { type: String },
    vEmail: { type: String, required: true, unique: true }
  });

  const areaEmpresaSchema = new mongoose.Schema({
    vCodigo: { type: String, required: true, maxlength: 13 },
    vDescripcion: { type: String, required: true, maxlength: 50 }
  });

  const cargoEmpresaSchema = new mongoose.Schema({
    iId_CargoEmp: { type: Number, required: true, unique: true, autoIncrement: true },
    vCodigo: { type: String, required: true, maxlength: 13 },
    vNombre: { type: String, required: true, maxlength: 50 },
    vDescripcion: { type: String, maxlength: 50 }
  });

  const sedeSchema = new mongoose.Schema({
    vNombre: { type: String, required: true },
    vDireccion: { type: String }
  });

  const paisSchema = new mongoose.Schema({
    vCodigo: { type: String, required: true, unique: true, maxlength: 11 },
    vCodigoMovil: { type: String, required: true, unique: true, maxlength: 5 },
    vDescripcion: { type: String, required: true, maxlength: 50 }
  });

  const personaSchema = new mongoose.Schema({
    vEmail: { type: String, required: true },
    vNombre: { type: String, maxlength: 50 },
    vApePaterno: { type: String, maxlength: 50 },
    vApeMaterno: { type: String, maxlength: 50 },
    vNumDocumento: { type: String, maxlength: 20 },
    vNumSeguroSocial: { type: String, maxlength: 20 },
    vCelular: { type: String, maxlength: 15 }
  });

  const companyEconomicActivitySchema = new mongoose.Schema({
    iId_Estado: { type: Number },
    dFechaRegistro: { type: Date, default: Date.now }
  });

  const isoSchema = new mongoose.Schema({
    iId_Estado: { type: Number, required: true },
    vNombre: { type: String, required: true, maxlength: 50 },
    vDescripcion: { type: String },
    dFechaRegistro: { type: Date, default: Date.now }
  });

  // Crear modelos
  const User = mongoose.model('User', userSchema, 'user');
  const Company = mongoose.model('Company', companySchema, 'company'); // Aquí se asegura que use la colección 'company'
  const AreaEmpresa = mongoose.model('AreaEmpresa', areaEmpresaSchema, 'areaEmpresa');
  const CargoEmpresa = mongoose.model('CargoEmpresa', cargoEmpresaSchema, 'cargoEmpresa');
  const Sede = mongoose.model('Sede', sedeSchema, 'sede');
  const Pais = mongoose.model('Pais', paisSchema,'pais');
  const Persona = mongoose.model('Persona', personaSchema,'persona');
  const CompanyEconomicActivity = mongoose.model('CompanyEconomicActivity', companyEconomicActivitySchema, 'companyEconomicActivity');
  const Iso = mongoose.model('Iso', isoSchema, 'iso');

  // Verificar y llenar datos de ejemplo
  try {
    // Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      for (let i = 0; i < 10; i++) {
        const user = new User({
          email: faker.internet.email(),
          password: faker.internet.password()
        });
        await user.save();
      }
      console.log('Sample users created');
    }

    // Companies
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      for (let i = 0; i < 10; i++) {
        const company = new Company({
          vNumDocumento: faker.datatype.uuid(),
          vNombre: faker.company.companyName(),
          vDireccion: faker.address.streetAddress(),
          vEmail: faker.internet.email()
        });
        await company.save();
      }
      console.log('Sample companies created');
    }

    // Areas de Empresa
    const areaEmpresaCount = await AreaEmpresa.countDocuments();
    if (areaEmpresaCount === 0) {
      for (let i = 0; i < 10; i++) {
        const area = new AreaEmpresa({
          vCodigo: faker.datatype.uuid().substring(0, 13),
          vDescripcion: faker.lorem.sentence(5).substring(0, 50) // Limitar la longitud de la descripción
        });
        await area.save();
      }
      console.log('Sample areas created');
    }

    // Cargos de Empresa
    const cargoEmpresaCount = await CargoEmpresa.countDocuments();
    if (cargoEmpresaCount === 0) {
      for (let i = 0; i < 10; i++) {
        const cargo = new CargoEmpresa({
          iId_CargoEmp: faker.datatype.number(),
          vCodigo: faker.datatype.uuid().substring(0, 13),
          vNombre: faker.name.jobTitle(),
          vDescripcion: faker.lorem.sentence(5).substring(0, 50) // Limitar la longitud de la descripción
        });
        await cargo.save();
      }
      console.log('Sample cargos created');
    }

    // Sedes
    const sedeCount = await Sede.countDocuments();
    if (sedeCount === 0) {
      for (let i = 0; i < 10; i++) {
        const sede = new Sede({
          vNombre: faker.company.companyName(),
          vDireccion: faker.address.city()
        });
        await sede.save();
      }
      console.log('Sample sedes created');
    }

    // Paises
    const paisCount = await Pais.countDocuments();
    if (paisCount === 0) {
      const paises = new Set();
      for (let i = 0; i < 10; i++) {
        let codigo = faker.address.countryCode().substring(0, 11);
        while (paises.has(codigo)) {
          codigo = faker.address.countryCode().substring(0, 11);
        }
        paises.add(codigo);
        const pais = new Pais({
          vCodigo: codigo,
          vCodigoMovil: faker.datatype.string(5),
          vDescripcion: faker.address.country().substring(0, 50)
        });
        await pais.save();
      }
      console.log('Sample paises created');
    }

    // Personas
    const personaCount = await Persona.countDocuments();
    if (personaCount === 0) {
      for (let i = 0; i < 10; i++) {
        const persona = new Persona({
          vEmail: faker.internet.email(),
          vNombre: faker.name.firstName().substring(0, 50),
          vApePaterno: faker.name.lastName().substring(0, 50),
          vApeMaterno: faker.name.lastName().substring(0, 50),
          vNumDocumento: faker.datatype.uuid().substring(0, 20),
          vNumSeguroSocial: faker.datatype.uuid().substring(0, 20),
          vCelular: faker.phone.phoneNumber().substring(0, 15)
        });
        await persona.save();
      }
      console.log('Sample personas created');
    }

    // Company Economic Activities
    const companyEconomicActivityCount = await CompanyEconomicActivity.countDocuments();
    if (companyEconomicActivityCount === 0) {
      for (let i = 0; i < 10; i++) {
        const companyEconomicActivity = new CompanyEconomicActivity({
          iId_Estado: faker.datatype.number({ min: 1, max: 2 }),
          dFechaRegistro: faker.date.past()
        });
        await companyEconomicActivity.save();
      }
      console.log('Sample company economic activities created');
    }

    // ISOs
    const isoCount = await Iso.countDocuments();
    if (isoCount === 0) {
      for (let i = 0; i < 10; i++) {
        const iso = new Iso({
          iId_Estado: faker.datatype.number({ min: 1, max: 2 }),
          vNombre: faker.company.companyName().substring(0, 50),
          vDescripcion: faker.lorem.sentence(5).substring(0, 50), // Limitar la longitud de la descripción
          dFechaRegistro: faker.date.past()
        });
        await iso.save();
      }
      console.log('Sample isos created');
    }

    console.log('Sample data created successfully');
  } catch (err) {
    console.error('Error during initialization:', err);
  } finally {
    mongoose.connection.close();
  }
});
