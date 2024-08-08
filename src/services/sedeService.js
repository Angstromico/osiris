const Sede = require('../model/sedeSchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Definir campos requeridos para la sede
const REQUIRED_FIELDS = ['vNombre', 'iId_Estado'];

// Función para validar campos requeridos
const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

// Crear una nueva sede
const createSede = async (sedeData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(sedeData);
    if (validationError) {
      throw new Error(validationError);
    }
    const newSede = new Sede(sedeData);
    const result = await client.db('isoDb').collection('sede').insertOne(newSede);
    return result.ops[0];
  } catch (error) {
    throw new Error('Error creating sede: ' + error.message);
  } finally {
    await client.close();
  }
};

// Obtener una sede por su ID
const getSedeById = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const sede = await client.db('isoDb').collection('sede').findOne({ _id: new ObjectId(id) });
    return sede;
  } catch (error) {
    throw new Error('Error fetching sede by ID: ' + error.message);
  } finally {
    await client.close();
  }
};

// Obtener todas las sedes
const getAllSedes = async () => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const sedes = await client.db('isoDb').collection('sede').find({}).toArray();
    return sedes;
  } catch (error) {
    throw new Error('Error fetching all sedes: ' + error.message);
  } finally {
    await client.close();
  }
};

// Actualizar una sede
const updateSede = async (id, updateData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(updateData);
    if (validationError) {
      throw new Error(validationError);
    }
    const result = await client.db('isoDb').collection('sede').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnOriginal: false }
    );
    return result.value;
  } catch (error) {
    throw new Error('Error updating sede: ' + error.message);
  } finally {
    await client.close();
  }
};

// Eliminar una sede
const deleteSede = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const result = await client.db('isoDb').collection('sede').findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
  } catch (error) {
    throw new Error('Error deleting sede: ' + error.message);
  } finally {
    await client.close();
  }
};

module.exports = {
  createSede,
  getSedeById,
  getAllSedes,
  updateSede,
  deleteSede,
};
