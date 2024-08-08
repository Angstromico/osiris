const express = require('express');
const router = express.Router();
const sedeService = require('../services/sedeService'); 

// Crear sede
router.post('/', async (req, res) => {
  try {
    const sedeData = req.body; 
    const createdSede = await sedeService.createSede(sedeData);
    res.status(201).json(createdSede); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener sede por ID
router.get('/:id', async (req, res) => {
  try {
    const sedeId = req.params.id; 
    const sedeRecord = await sedeService.getSedeById(sedeId);
    if (!sedeRecord) {
      return res.status(404).json({ message: 'Sede record not found' });
    }
    res.json(sedeRecord); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las sedes
router.get('/', async (req, res) => {
  try {
    const sedeRecords = await sedeService.getAllSedes();
    res.json(sedeRecords); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar sede
router.put('/:id', async (req, res) => {
  try {
    const sedeId = req.params.id; 
    const sedeData = req.body; 
    const updatedSede = await sedeService.updateSede(sedeId, sedeData);
    if (!updatedSede) {
      return res.status(404).json({ message: 'Sede record not found' });
    }
    res.json(updatedSede); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar sede
router.delete('/:id', async (req, res) => {
  try {
    const sedeId = req.params.id; 
    await sedeService.deleteSede(sedeId);
    res.status(204).json(); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
