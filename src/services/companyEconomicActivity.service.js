const CompanyEconomicActivity = require('../model/companyEconomicActivitySchema');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const REQUIRED_FIELDS = ['iId_Estado', 'dFechaRegistro'];

const validateRequiredFields = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return `El campo ${field} es requerido`;
    }
  }
  return null;
};

const createCompanyEconomicActivity = async (companyEconomicActivityData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(companyEconomicActivityData);
    if (validationError) {
      throw new Error(validationError);
    }
    const newCompanyEconomicActivity = new CompanyEconomicActivity(companyEconomicActivityData);
    const coll = client.db('isoDb').collection('companyEconomicActivity');
    const result = await coll.insertOne(newCompanyEconomicActivity);
    return result.ops[0];
  } catch (error) {
    throw new Error('Error creating CompanyEconomicActivity: ' + error.message);
  } finally {
    await client.close();
  }
};

const getCompanyEconomicActivityById = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const companyEconomicActivity = await client.db('isoDb').collection('companyEconomicActivity').findOne({ _id: new ObjectId(id) });
    return companyEconomicActivity;
  } catch (error) {
    throw new Error('Error fetching CompanyEconomicActivity by ID: ' + error.message);
  } finally {
    await client.close();
  }
};

const getAllCompanyEconomicActivitys = async () => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const companyEconomicActivitys = await client.db('isoDb').collection('companyEconomicActivity').find({}).toArray();
    return companyEconomicActivitys;
  } catch (error) {
    throw new Error('Error fetching all CompanyEconomicActivitys: ' + error.message);
  } finally {
    await client.close();
  }
};

const updateCompanyEconomicActivity = async (id, updateData) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const validationError = validateRequiredFields(updateData);
    if (validationError) {
      throw new Error(validationError);
    }
    const result = await client.db('isoDb').collection('companyEconomicActivity').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnOriginal: false }
    );
    return result.value;
  } catch (error) {
    throw new Error('Error updating CompanyEconomicActivity: ' + error.message);
  } finally {
    await client.close();
  }
};

const deleteCompanyEconomicActivity = async (id) => {
  const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const result = await client.db('isoDb').collection('companyEconomicActivity').findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
  } catch (error) {
    throw new Error('Error deleting CompanyEconomicActivity: ' + error.message);
  } finally {
    await client.close();
  }
};

module.exports = {
  createCompanyEconomicActivity,
  getCompanyEconomicActivityById,
  getAllCompanyEconomicActivitys,
  updateCompanyEconomicActivity,
  deleteCompanyEconomicActivity,
};
