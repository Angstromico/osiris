const express = require('express');
const router = express.Router();
const personaService = require('../services/personaService');

// Crear Persona
router.post('/', async (req, res) => {
  try {
    const personaData = req.body;
    const newPersona = await personaService.createPersona(personaData);
    res.status(201).json(newPersona);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Obtener Persona por ID
router.get('/:id', async (req, res) => {
  try {
    const persona = await personaService.getPersonaById(req.params.id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    res.json(persona);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Obtener todas las Personas
router.get('/', async (req, res) => {
  try {
    const personas = await personaService.getAllPersonas();
    res.json(personas);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Actualizar Persona
router.put('/:id', async (req, res) => {
  try {
    const updatedPersona = await personaService.updatePersona(req.params.id, req.body);
    if (!updatedPersona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    res.json(updatedPersona);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Eliminar Persona
router.delete('/:id', async (req, res) => {
  try {
    const deletedPersona = await personaService.deletePersona(req.params.id);
    if (!deletedPersona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    res.json({ message: 'Persona deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;
