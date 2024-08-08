const Trabajador = require('../model/trabajadorSchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const REQUIRED_FIELDS = [
  'vCorreoTrabajo', 'vCorreoPersonal', 'vNombres', 'vApePaterno', 'vApeMaterno',
  'vNumDocumento', 'vNacionalidad', 'vTelefonoPersonal', 'vDireccion', 'dFechaNacimiento',
  'vArea', 'vCargo', 'vRolSistema', 'dFechaIngresoArea', 'dFechaIngresoEmpresa', 'vSedeTrabajo', 'vStatus'
];

// Función para validar campos requeridos
const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

// Crear un nuevo trabajador
const createTrabajador = async (trabajadorData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(trabajadorData);
    if (validationError) {
      throw new Error(validationError);
    }
    const newTrabajador = new Trabajador(trabajadorData);
    const coll = client.db('isoDb').collection('trabajador');
    const usuario = client.db('isoDb').collection('user');
    const result = await coll.insertOne(newTrabajador);
    const newUser = {
      email: trabajadorData.vCorreoTrabajo,
      password: "generic1234"
    };
    await usuario.insertOne(newUser);
    return result.ops[0];
  } catch (error) {
    throw new Error('Error creating trabajador: ' + error.message);
  } finally {
    await client.close();
  }
};

// Obtener un trabajador por su ID
const getTrabajadorById = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const trabajador = await client.db('isoDb').collection('trabajador').findOne({ _id: new ObjectId(id) });
    return trabajador;
  } catch (error) {
    throw new Error('Error fetching trabajador by ID: ' + error.message);
  } finally {
    await client.close();
  }
};

// Obtener todos los trabajadores
const getAllTrabajadores = async () => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const trabajadores = await client.db('isoDb').collection('trabajador').find({}).toArray();
    return trabajadores;
  } catch (error) {
    throw new Error('Error fetching all trabajadores: ' + error.message);
  } finally {
    await client.close();
  }
};

// Actualizar un trabajador
const updateTrabajador = async (id, updateData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(updateData);
    if (validationError) {
      throw new Error(validationError);
    }
    const result = await client.db('isoDb').collection('trabajador').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnOriginal: false }
    );
    return result.value;
  } catch (error) {
    throw new Error('Error updating trabajador: ' + error.message);
  } finally {
    await client.close();
  }
};

// Eliminar un trabajador
const deleteTrabajador = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const result = await client.db('isoDb').collection('trabajador').findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
  } catch (error) {
    throw new Error('Error deleting trabajador: ' + error.message);
  } finally {
    await client.close();
  }
};

module.exports = {
  createTrabajador,
  getTrabajadorById,
  getAllTrabajadores,
  updateTrabajador,
  deleteTrabajador,
};
