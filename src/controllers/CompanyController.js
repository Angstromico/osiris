const express = require('express');
const router = express.Router();
const companyService = require('../services/companyService');

// Crear una nueva empresa
router.post('/', async (req, res) => {
  try {
    const companyData = req.body;
    const newCompany = await companyService.createCompany(companyData);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Obtener todas las empresas
router.get('/', async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Obtener una empresa específica por ID
router.get('/:id', async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Actualizar una empresa específica
router.put('/:id', async (req, res) => {
  try {
    const updatedCompany = await companyService.updateCompany(req.params.id, req.body);
    if (!updatedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(updatedCompany);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Eliminar una empresa específica
router.delete('/:id', async (req, res) => {
  try {
    const deletedCompany = await companyService.deleteCompany(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ message: 'Company deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;
