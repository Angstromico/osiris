const Area = require('../model/areaEmpresaSchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const REQUIRED_FIELDS = ['vCodigo', 'vDescripcion'];

const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

const createArea = async (req, res) => {
  const areaData = req.body;
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(areaData);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const newArea = new Area(areaData);
    const coll = client.db('isoDb').collection('areaEmpresa');
    const result = await coll.insertOne(newArea);
    res.status(201).json({ message: 'Area created successfully', area: result.ops[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

const getAreaById = async (req, res) => {
  const areaId = req.params.id;
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const area = await client.db('isoDb').collection('areaEmpresa').findOne({ _id: new ObjectId(areaId) });
    if (!area) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.status(200).json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

const getAllAreas = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const areas = await client.db('isoDb').collection('areaEmpresa').find({}).toArray();
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

const updateArea = async (req, res) => {
  const areaId = req.params.id;
  const updatedArea = req.body;
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(updatedArea);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const result = await client.db('isoDb').collection('areaEmpresa').findOneAndUpdate(
      { _id: new ObjectId(areaId) },
      { $set: updatedArea },
      { returnOriginal: false }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.status(200).json({ message: 'Area updated successfully', area: result.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

const deleteArea = async (req, res) => {
  const areaId = req.params.id;
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const result = await client.db('isoDb').collection('areaEmpresa').findOneAndDelete({ _id: new ObjectId(areaId) });
    if (!result.value) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.status(200).json({ message: 'Area deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

module.exports = {
  createArea,
  getAreaById,
  getAllAreas,
  updateArea,
  deleteArea,
};
