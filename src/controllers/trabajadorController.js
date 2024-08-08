const express = require('express');
const router = express.Router();
const trabajadorService = require('../services/trabajadorService');

// Crear Trabajador
router.post('/', async (req, res) => {
  try {
    const newTrabajador = await trabajadorService.createTrabajador(req.body);
    res.status(201).json(newTrabajador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener Trabajador por ID
router.get('/:id', async (req, res) => {
  try {
    const trabajador = await trabajadorService.getTrabajadorById(req.params.id);
    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador not found' });
    }
    res.json(trabajador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los Trabajadores
router.get('/', async (req, res) => {
  try {
    const trabajadores = await trabajadorService.getAllTrabajadores();
    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar Trabajador
router.put('/:id', async (req, res) => {
  try {
    const updatedTrabajador = await trabajadorService.updateTrabajador(req.params.id, req.body);
    if (!updatedTrabajador) {
      return res.status(404).json({ error: 'Trabajador not found' });
    }
    res.json(updatedTrabajador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar Trabajador
router.delete('/:id', async (req, res) => {
  try {
    const deletedTrabajador = await trabajadorService.deleteTrabajador(req.params.id);
    if (!deletedTrabajador) {
      return res.status(404).json({ error: 'Trabajador not found' });
    }
    res.json({ message: 'Trabajador deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
