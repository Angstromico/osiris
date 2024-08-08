const Persona = require('../model/personaSchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const REQUIRED_FIELDS = ['vEmail', 'vNombre', 'vApePaterno', 'vApeMaterno', 'vNumDocumento', 'vNacionalidad', 'vCelular', 'vDireccion', 'dFechaNacimiento'];

const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

const createPersona = async (personaData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(personaData);
    if (validationError) {
      throw new Error(validationError);
    }
    const newPerson = new Persona(personaData);
    const coll = client.db('isoDb').collection('persona');
    const usuario = client.db('isoDb').collection('user');
    const result = await coll.insertOne(newPerson);
    const newUser = {
      email: personaData.vEmail,
      password: "generic1234"
    };
    await usuario.insertOne(newUser);
    return result.ops[0];
  } catch (error) {
    throw new Error('Error creating persona: ' + error.message);
  } finally {
    await client.close();
  }
};

const getPersonaById = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const persona = await client.db('isoDb').collection('persona').findOne({ _id: new ObjectId(id) });
    return persona;
  } catch (error) {
    throw new Error('Error fetching persona by ID: ' + error.message);
  } finally {
    await client.close();
  }
};

const getAllPersonas = async () => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const personas = await client.db('isoDb').collection('persona').find({}).toArray();
    return personas;
  } catch (error) {
    throw new Error('Error fetching all personas: ' + error.message);
  } finally {
    await client.close();
  }
};

const updatePersona = async (id, updateData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(updateData);
    if (validationError) {
      throw new Error(validationError);
    }
    const result = await client.db('isoDb').collection('persona').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnOriginal: false }
    );
    return result.value;
  } catch (error) {
    throw new Error('Error updating persona: ' + error.message);
  } finally {
    await client.close();
  }
};

const deletePersona = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const result = await client.db('isoDb').collection('persona').findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
  } catch (error) {
    throw new Error('Error deleting persona: ' + error.message);
  } finally {
    await client.close();
  }
};

module.exports = {
  createPersona,
  getPersonaById,
  getAllPersonas,
  updatePersona,
  deletePersona,
};
