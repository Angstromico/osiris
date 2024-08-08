const Company = require('../model/companySchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const REQUIRED_FIELDS = ['vRuc', 'vRazonSocial', 'vCorreoEmpresa', 'vContrasena', 'vCiudad', 'tamanoEmpresa', 'vActividadEconomica'];

const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

// Crear una nueva empresa
const createCompany = async (companyData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(companyData);
    if (validationError) {
      throw new Error(validationError);
    }
    const newCompany = new Company(companyData);
    const coll = client.db('isoDb').collection('company');
    const result = await coll.insertOne(newCompany);
    return result.ops[0];
  } catch (error) {
    throw new Error('Error creating company: ' + error.message);
  } finally {
    await client.close();
  }
};

// Obtener una empresa por su ID
const getCompanyById = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const company = await client.db('isoDb').collection('company').findOne({ _id: new ObjectId(id) });
    return company;
  } catch (error) {
    throw new Error('Error fetching company by ID: ' + error.message);
  } finally {
    await client.close();
  }
};

// Obtener todas las empresas
const getAllCompanies = async () => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const companies = await client.db('isoDb').collection('company').find({}).toArray();
    return companies;
  } catch (error) {
    throw new Error('Error fetching all companies: ' + error.message);
  } finally {
    await client.close();
  }
};

// Actualizar una empresa
const updateCompany = async (id, updateData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(updateData);
    if (validationError) {
      throw new Error(validationError);
    }
    const result = await client.db('isoDb').collection('company').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result.value;
  } catch (error) {
    throw new Error('Error updating company: ' + error.message);
  } finally {
    await client.close();
  }
};

// Eliminar una empresa
const deleteCompany = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const result = await client.db('isoDb').collection('company').findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
  } catch (error) {
    throw new Error('Error deleting company: ' + error.message);
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
