const Objetivos = require('../model/objetivosMetas.js')

const crearObjetivo = async (req, res) => {
  try {
    const objetivo = await Objetivos.create(req.body)
    res.status(200).json(objetivo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const encontrarObjetivos = async (req, res) => {
  try {
    const objetivos = await Objetivos.find({})
    res.status(200).json(objetivos)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const encontrarObjetivo = async (req, res) => {
  try {
    const { id } = req.params
    const objetivo = await Objetivos.findById(id)
    res.status(200).json(objetivo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const modificarObjetivo = async (req, res) => {
  try {
    const { id } = req.params
    const objetivo = await Objetivos.findByIdAndUpdate(id, req.body)
    if (!objetivo) {
      return res.status(404).json({ message: 'Objetivo no encontrado' })
    }
    const nuevoObjetivo = await Objetivos.findById(id)
    res.status(200).json(nuevoObjetivo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const eliminarObjetivo = async (req, res) => {
  try {
    const { id } = req.params
    const objetivo = await Objetivos.findByIdAndDelete(id)
    if (!objetivo) {
      return res.status(404).json({ message: 'Objetivo no encontrado' })
    }
    res.status(200).json({ message: 'Objetivo borrado exitosamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  crearObjetivo,
  encontrarObjetivos,
  encontrarObjetivo,
  modificarObjetivo,
  eliminarObjetivo,
}
