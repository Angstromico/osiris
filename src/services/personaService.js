const Persona = require('../model/personaSchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const REQUIRED_FIELDS = ['vCorreoTrabajo', 'vCorreoPersonal', 'vNombre', 'vApePaterno', 'vApeMaterno', 'vNumDocumento', 'vNacionalidad', 'vCelular', 'vDireccion', 'dFechaNacimiento', 'vArea', 'vCargo', 'vRolSistema', 'dFechaIngresoArea', 'dFechaIngresoEmpresa', 'vSedeTrabajo'];

// Función para validar campos requeridos
const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

// Crear una nueva persona
const createPersona = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const newPerson = new Persona(req.body);
    const coll = client.db('isoDb').collection('persona');
    const usuario = client.db('isoDb').collection('user');
    const result = await coll.insertOne(newPerson);
    const newUser = {
      email: req.body.vCorreoTrabajo,
      password: "generic1234"
    };
    await usuario.insertOne(newUser);
    console.log(`New person inserted with ID: ${result.insertedId}`);
    res.status(201).json({ message: 'Person created successfully', personId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

// Obtener una persona por su ID
const getPersonaById = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const personId = req.params.id;
    const db = client.db('isoDb');
    const collection = db.collection('persona');
    const filter = { _id: new ObjectId(personId) };
    const persona = await collection.findOne(filter);

    if (!persona) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.status(200).json(persona);
  } catch (error) {
    console.error('Error fetching person:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
};

// Obtener todas las personas
const getAllPersonas = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const filter = {};
    const persons = client.db('isoDb').collection('persona');
    const cursor = persons.find(filter);
    const data = await cursor.toArray();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error al realizar la búsqueda"
    });
  } finally {
    await client.close();
  }
};

// Actualizar una persona
const updatePersona = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('isoDb');
    const collection = db.collection('persona');
    const personId = req.params.id;
    const updatedPerson = req.body;
    const validationError = validateRequiredFields(updatedPerson);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const filter = { _id: new ObjectId(personId) };
    const result = await collection.findOneAndUpdate(
      filter,
      { $set: updatedPerson },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.status(200).json({ message: 'Person updated successfully', person: result.value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
};

// Eliminar una persona
const deletePersona = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('isoDb');
    const persons = db.collection('persona');
    const personId = req.params.id;
    const filter = { _id: new ObjectId(personId) };
    const result = await persons.findOneAndDelete(filter);
    if (!result.value) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
