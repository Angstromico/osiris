const Company = require('../model/companySchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const REQUIRED_FIELDS = ['vRUC', 'vRazonSocial', 'vCorreoEmpresa', 'vContrasena', 'vCiudad', 'vTamanoEmpresa', 'vActividadEconomica'];

// Función para validar campos requeridos
const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

// Crear una nueva empresa
const createCompany = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect(); // Conectar a la base de datos
    const validationError = validateRequiredFields(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const newCompany = new Company(req.body); // Crear nueva instancia de la empresa con los datos del cuerpo de la solicitud
    const coll = client.db('isoDb').collection('company'); // Seleccionar la colección 'company' en la base de datos 'isoDb'
    const result = await coll.insertOne(newCompany); // Insertar la nueva empresa en la colección
    console.log(`New company inserted with ID: ${result.insertedId}`);
    res.status(201).json({ message: 'Company created successfully', companyId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close(); // Cerrar la conexión a la base de datos
  }
};

// Obtener una empresa por su ID
const getCompanyById = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const companyId = req.params.id;
    const db = client.db('isoDb');
    const collection = db.collection('company');
    const filter = { _id: new ObjectId(companyId) };
    const company = await collection.findOne(filter);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
};

// Obtener todas las empresas
const getAllCompanies = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const filter = {};
    const companies = client.db('isoDb').collection('company');
    const cursor = companies.find(filter);
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

// Actualizar una empresa
const updateCompany = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('isoDb');
    const collection = db.collection('company');
    const companyId = req.params.id;
    const updatedCompany = req.body;
    const validationError = validateRequiredFields(updatedCompany);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const filter = { _id: new ObjectId(companyId) };
    const result = await collection.findOneAndUpdate(
      filter,
      { $set: updatedCompany },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json({ message: 'Company updated successfully', company: result.value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
};

// Eliminar una empresa
const deleteCompany = async (req, res) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('isoDb');
    const companies = db.collection('company');
    const companyId = req.params.id;
    const filter = { _id: new ObjectId(companyId) };
    const result = await companies.findOneAndDelete(filter);
    if (!result.value) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};

module.exports = {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompany,
};
