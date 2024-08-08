const mongoose = require("mongoose");
const faker = require("faker"); // Asegúrate de instalar faker: npm install faker

const mongoURI = process.env.URI || "mongodb://127.0.0.1:27017/isoDb";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("Connected to the database");

  // Definir esquemas y modelos

  const trabajadorSchema = new mongoose.Schema({
    vNumDocumento: { type: String, required: true, maxlength: 20 },
    vApePaterno: { type: String, required: true, maxlength: 50 },
    vApeMaterno: { type: String, required: true, maxlength: 50 },
    vNombres: { type: String, required: true, maxlength: 50 },
    vDireccion: { type: String, required: true },
    vDistrito: { type: String, required: true },
    vCorreoTrabajo: { type: String, required: true },
    vCorreoPersonal: { type: String, required: true },
    vNacionalidad: { type: String, required: true },
    vGenero: { type: String, required: true, enum: ['Masculino', 'Femenino'] },
    vEstadoCivil: { type: String, required: true, enum: ['Soltero', 'Casado', 'Divorciado', 'Conviviente', 'Viudo/a'] },
    dFechaNacimiento: { type: Date, required: true },
    vTelefonoPersonal: { type: String, required: true, maxlength: 15 },
    vbReconocimientoFacial: { type: Buffer, required: false },
    vbFirmaDigital: { type: Buffer, required: false },
    vArea: { type: String, required: true },
    vCargo: { type: String, required: true },
    vRolSistema: { type: String, required: true },
    dFechaIngresoArea: { type: Date, required: true },
    dFechaIngresoEmpresa: { type: Date, required: true },
    vStatus: { type: String, required: true },
    vSedeTrabajo: { type: String, required: true },
  });

  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  });

  const companySchema = new mongoose.Schema({
    iId_Estado: { type: Number, required: false },
    iId_TipDocumento: { type: Number, required: false },
    vNumDocumento: { type: String, required: true, unique: true },
    vNombre: { type: String, required: true },
    vContacto: { type: String },
    vDireccion: { type: String },
    vCiudad: { type: String, required: true },
    dFechaRegistro: { type: Date, default: Date.now },
    vEmail: { type: String, required: true, unique: true },
    iso: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companyIso",
        required: false,
      },
    ],
    companyArea: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companyArea",
        required: false,
      },
    ],
    pais: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pais",
        required: true,
      },
    ],
    sede: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sede",
        required: false,
      },
    ],
    companyEconomicActivity: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companyEconomicActivity",
        required: false,
      },
    ],
    vRuc: { type: String, unique: true, required: true },
    vRazonSocial: { type: String, required: true },
    vCorreoEmpresa: { type: String, required: true, unique: true },
    vContrasena: { type: String, required: true },
    tamanoEmpresa: { type: Number, required: true }, // 1: Pequeña, 2: Mediana, 3: Grande, 4: Micro Empresa
    vActividadEconomica: { type: String, required: true },
  });

  const areaEmpresaSchema = new mongoose.Schema({
    vCodigo: { type: String, required: true, maxlength: 13 },
    vDescripcion: { type: String, required: true, maxlength: 50 },
  });

  const cargoEmpresaSchema = new mongoose.Schema({
    iId_CargoEmp: {
      type: Number,
      required: true,
      unique: true,
      autoIncrement: true,
    },
    vCodigo: { type: String, required: true, maxlength: 13 },
    vNombre: { type: String, required: true, maxlength: 50 },
    vDescripcion: { type: String, maxlength: 50 },
  });

  const sedeSchema = new mongoose.Schema({
    iId_Ubigeo: {
      type: String,
      required: false
    },
    iId_Estado: {
      type: String,
      required: true,
      enum: ['Activo', 'Inactivo']
    },
    vNombre: {
      type: String,
      required: true
    },
    vDireccion: {
      type: String,
      required: false
    }
  });

  const paisSchema = new mongoose.Schema({
    vCodigo: { type: String, required: true, unique: true, maxlength: 11 },
    vCodigoMovil: { type: String, required: true, unique: true, maxlength: 5 },
    vDescripcion: { type: String, required: true, maxlength: 50 },
  });

  const personaSchema = new mongoose.Schema({
    iId_TipDocumento: {
      type: Number,
      required: false,
      enum: [1, 2, 3, 4, 5],
    },
    vEmail: {
      type: String,
      required: true,
    },
    iId_GeneroPersona: {
      type: Number,
      required: false,
    },
    iId_NivelEstudio: {
      type: Number,
      required: false,
    },
    iId_Ubigeo: {
      type: Number,
      required: false,
    },
    iId_Estado: {
      type: Number,
      required: false,
      enum: [1, 2, 3, 4],
    },
    iId_EstadoCivil: {
      type: Number,
      required: false,
      enum: [1, 2, 3, 4, 5],
    },
    iId_TipSegMedico: {
      type: Number,
      required: false,
    },
    iId_SistPension: {
      type: Number,
      required: false,
    },
    vActaNacimiento: {
      type: String,
      required: false,
    },
    vComprobanteDomicilio: {
      type: String,
      required: false,
    },
    vCodigoSegMedico: {
      type: String,
      maxlength: 50,
      required: false,
    },
    vNombre: {
      type: String,
      required: false,
      maxlength: 50,
    },
    vApePaterno: {
      type: String,
      required: false,
      maxlength: 50,
    },
    vApeMaterno: {
      type: String,
      maxlength: 50,
      required: false,
    },
    vNumDocumento: {
      type: String,
      required: false,
      maxlength: 20,
    },
    vNacionalidad: {
      type: String,
      required: false,
    },
    vNumSeguroSocial: {
      type: String,
      maxlength: 20,
      required: false,
    },
    vCelular: {
      type: String,
      maxlength: 15,
      required: false,
    },
    vDireccion: {
      type: String,
      required: false,
    },
    dFechaNacimiento: {
      type: Date,
      required: false,
    },
    dFechaIngreso: {
      type: Date,
      required: false,
    },
    vbFacial: {
      type: Buffer,
      required: false,
    },
    vbFirmaDigital: {
      type: Buffer,
      required: false,
    },
    dFechaRegistro: { type: Date, default: Date.now, required: true },
    companyAreas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "personArea",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  });

  const companyEconomicActivitySchema = new mongoose.Schema({
    iId_Estado: { type: Number },
    dFechaRegistro: { type: Date, default: Date.now },
  });

  const isoSchema = new mongoose.Schema({
    iId_Estado: { type: Number, required: true },
    vNombre: { type: String, required: true, maxlength: 50 },
    vDescripcion: { type: String },
    dFechaRegistro: { type: Date, default: Date.now },
  });

  // Crear modelos
  const Trabajador = mongoose.model("Trabajador", trabajadorSchema, "trabajador");

  const User = mongoose.model("User", userSchema, "user");
  const Company = mongoose.model("Company", companySchema, "company"); // Aquí se asegura que use la colección 'company'
  const AreaEmpresa = mongoose.model(
    "AreaEmpresa",
    areaEmpresaSchema,
    "areaEmpresa"
  );
  const CargoEmpresa = mongoose.model(
    "CargoEmpresa",
    cargoEmpresaSchema,
    "cargoEmpresa"
  );
  const Sede = mongoose.model("Sede", sedeSchema, "sede");
  const Pais = mongoose.model("Pais", paisSchema, "pais");
  const Persona = mongoose.model("Persona", personaSchema, "persona");
  const CompanyEconomicActivity = mongoose.model(
    "CompanyEconomicActivity",
    companyEconomicActivitySchema,
    "companyEconomicActivity"
  );
  const Iso = mongoose.model("Iso", isoSchema, "iso");

  // Verificar y llenar datos de ejemplo
  try {
    // Trabajadores
    const trabajadorCount = await Trabajador.countDocuments();
    if (trabajadorCount === 0) {
      for (let i = 0; i < 10; i++) {
        const trabajador = new Trabajador({
          vNumDocumento: faker.random.alphaNumeric(10),
          vApePaterno: faker.name.lastName(),
          vApeMaterno: faker.name.lastName(),
          vNombres: faker.name.firstName(),
          vDireccion: faker.address.streetAddress(),
          vDistrito: faker.address.city(),
          vCorreoTrabajo: faker.internet.email(),
          vCorreoPersonal: faker.internet.email(),
          vNacionalidad: faker.address.country(),
          vGenero: faker.random.arrayElement(['Masculino', 'Femenino']),
          vEstadoCivil: faker.random.arrayElement(['Soltero', 'Casado', 'Divorciado', 'Conviviente', 'Viudo/a']),
          dFechaNacimiento: faker.date.past(50, new Date(2002, 0, 1)),
          vTelefonoPersonal: faker.phone.phoneNumber('###########').substring(0, 15), // Limitar longitud
          vbReconocimientoFacial: Buffer.from(faker.random.alphaNumeric(10)),
          vbFirmaDigital: Buffer.from(faker.random.alphaNumeric(10)),
          vArea: faker.commerce.department(),
          vCargo: faker.name.jobTitle(),
          vRolSistema: faker.random.word(),
          dFechaIngresoArea: faker.date.past(10),
          dFechaIngresoEmpresa: faker.date.past(10),
          vStatus: faker.random.arrayElement(['Activo', 'Inactivo']),
          vSedeTrabajo: faker.address.city()
        });
        await trabajador.save();
      }
      console.log("Sample trabajadores created");
    }

  
    // Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      for (let i = 0; i < 10; i++) {
        const user = new User({
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        await user.save();
      }
      console.log("Sample users created");
    }

    // Companies
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      for (let i = 0; i < 10; i++) {
        const company = new Company({
          iId_Estado: faker.datatype.number({ min: 1, max: 4 }),
          iId_TipDocumento: faker.datatype.number({ min: 1, max: 5 }),
          vNumDocumento: faker.datatype.uuid(),
          vNombre: faker.company.companyName(),
          vContacto: faker.name.findName(),
          vDireccion: faker.address.streetAddress(),
          vCiudad: faker.address.city(),
          dFechaRegistro: faker.date.past(),
          vEmail: faker.internet.email(),
          vRuc: faker.datatype.uuid(),
          vRazonSocial: faker.company.companyName(),
          vCorreoEmpresa: faker.internet.email(),
          vContrasena: faker.internet.password(),
          tamanoEmpresa: faker.datatype.number({ min: 1, max: 4 }),
          vActividadEconomica: faker.commerce.department(),
        });
        await company.save();
      }
      console.log("Sample companies created");
    }

    // Areas de Empresa
    const areaEmpresaCount = await AreaEmpresa.countDocuments();
    if (areaEmpresaCount === 0) {
      for (let i = 0; i < 10; i++) {
        const area = new AreaEmpresa({
          vCodigo: faker.datatype.uuid().substring(0, 13),
          vDescripcion: faker.lorem.sentence(5).substring(0, 50), // Limitar la longitud de la descripción
        });
        await area.save();
      }
      console.log("Sample areas created");
    }

    // Cargos de Empresa
    const cargoEmpresaCount = await CargoEmpresa.countDocuments();
    if (cargoEmpresaCount === 0) {
      for (let i = 0; i < 10; i++) {
        const cargo = new CargoEmpresa({
          iId_CargoEmp: faker.datatype.number(),
          vCodigo: faker.datatype.uuid().substring(0, 13),
          vNombre: faker.name.jobTitle(),
          vDescripcion: faker.lorem.sentence(5).substring(0, 50), // Limitar la longitud de la descripción
        });
        await cargo.save();
      }
      console.log("Sample cargos created");
    }

    // Sedes

    const sedeCount = await Sede.countDocuments();
    if (sedeCount === 0) {
      for (let i = 0; i < 10; i++) {
        const sede = new Sede({
          iId_Ubigeo: faker.random.alphaNumeric(10),
          iId_Estado: faker.random.arrayElement(["Activo", "Inactivo"]),
          vNombre: faker.company.companyName(),
          vDireccion: faker.address.streetAddress(),
        });
        await sede.save();
      }
      console.log("Sample sedes created");
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
          vDescripcion: faker.address.country().substring(0, 50),
        });
        await pais.save();
      }
      console.log("Sample paises created");
    }

    // Personas
    const personaCount = await Persona.countDocuments();
    if (personaCount === 0) {
      for (let i = 0; i < 10; i++) {
        const persona = new Persona({
          iId_TipDocumento: faker.random.arrayElement([1, 2, 3, 4, 5]),
          vEmail: faker.internet.email(),
          iId_GeneroPersona: faker.datatype.number({ min: 1, max: 2 }),
          iId_NivelEstudio: faker.datatype.number({ min: 1, max: 5 }),
          iId_Ubigeo: faker.datatype.number(),
          iId_Estado: faker.datatype.number({ min: 1, max: 4 }),
          iId_EstadoCivil: faker.datatype.number({ min: 1, max: 5 }),
          iId_TipSegMedico: faker.datatype.number(),
          iId_SistPension: faker.datatype.number(),
          vActaNacimiento: faker.lorem.words(),
          vComprobanteDomicilio: faker.lorem.words(),
          vCodigoSegMedico: faker.lorem.words(),
          vNombre: faker.name.firstName(),
          vApePaterno: faker.name.lastName(),
          vApeMaterno: faker.name.lastName(),
          vNumDocumento: faker.random.alphaNumeric(10),
          vNacionalidad: faker.address.country(),
          vNumSeguroSocial: faker.random.alphaNumeric(10),
          vCelular: String(
            faker.datatype.number({ min: 1000000000, max: 999999999999 })
          ).substring(0, 15), // Solo números y limitar longitud
          vDireccion: faker.address.streetAddress(),
          dFechaNacimiento: faker.date.past(50, new Date(2002, 0, 1)),
          dFechaIngreso: faker.date.past(10),
          vbFacial: Buffer.from(faker.random.alphaNumeric(10)),
          vbFirmaDigital: Buffer.from(faker.random.alphaNumeric(10)),
          user: mongoose.Types.ObjectId(), // Asegúrate de que este ID existe en la colección de usuarios
        });
        await persona.save();
      }
      console.log("Sample personas created");
    }

    // Company Economic Activities
    const companyEconomicActivityCount =
      await CompanyEconomicActivity.countDocuments();
    if (companyEconomicActivityCount === 0) {
      for (let i = 0; i < 10; i++) {
        const companyEconomicActivity = new CompanyEconomicActivity({
          iId_Estado: faker.datatype.number({ min: 1, max: 2 }),
          dFechaRegistro: faker.date.past(),
        });
        await companyEconomicActivity.save();
      }
      console.log("Sample company economic activities created");
    }

    // ISOs
    const isoCount = await Iso.countDocuments();
    if (isoCount === 0) {
      for (let i = 0; i < 10; i++) {
        const iso = new Iso({
          iId_Estado: faker.datatype.number({ min: 1, max: 2 }),
          vNombre: faker.company.companyName().substring(0, 50),
          vDescripcion: faker.lorem.sentence(5).substring(0, 50), // Limitar la longitud de la descripción
          dFechaRegistro: faker.date.past(),
        });
        await iso.save();
      }
      console.log("Sample isos created");
    }

    console.log("Sample data created successfully");
  } catch (err) {
    console.error("Error during initialization:", err);
  } finally {
    mongoose.connection.close();
  }
});
