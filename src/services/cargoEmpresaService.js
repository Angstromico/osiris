const Cargo = require('../model/cargoEmpresaSchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const REQUIRED_FIELDS = ['vCodigo', 'vNombre', 'vDescripcion'];

const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

const createCargo = async (req, res) => {
  const cargoData = req.body;
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(cargoData);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const newCargo = new Cargo(cargoData);
    const coll = client.db('isoDb').collection('cargoEmpresa');
    const result = await coll.insertOne(newCargo);
    res.status(201).json({ message: 'Cargo created successfully', cargo: result.ops[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

const getCargoById = async (req, res) => {
  const cargoId = req.params.id;
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const cargo = await client.db('isoDb').collection('cargoEmpresa').findOne({ _id: new ObjectId(cargoId) });
    if (!cargo) {
      return res.status(404).json({ message: 'Cargo not found' });
    }
    res.status(200).json(cargo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

const getAllCargos = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const cargos = await client.db('isoDb').collection('cargoEmpresa').find({}).toArray();
    res.status(200).json(cargos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

const updateCargo = async (req, res) => {
  const cargoId = req.params.id;
  const updatedCargo = req.body;
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(updatedCargo);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const result = await client.db('isoDb').collection('cargoEmpresa').findOneAndUpdate(
      { _id: new ObjectId(cargoId) },
      { $set: updatedCargo },
      { returnOriginal: false }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Cargo not found' });
    }
    res.status(200).json({ message: 'Cargo updated successfully', cargo: result.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

const deleteCargo = async (req, res) => {
  const cargoId = req.params.id;
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const result = await client.db('isoDb').collection('cargoEmpresa').findOneAndDelete({ _id: new ObjectId(cargoId) });
    if (!result.value) {
      return res.status(404).json({ message: 'Cargo not found' });
    }
    res.status(200).json({ message: 'Cargo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

module.exports = {
  createCargo,
  getCargoById,
  getAllCargos,
  updateCargo,
  deleteCargo,
};
