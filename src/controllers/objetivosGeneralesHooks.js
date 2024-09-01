const Objetivos = require('../model/objetivoGenerales')

const crearObjetivoGeneral = async (req, res) => {
  try {
    const objetivo = await Objetivos.create(req.body)
    res.status(200).json(objetivo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const encontrarObjetivosGenerales = async (req, res) => {
  try {
    const objetivos = await Objetivos.find({})
    res.status(200).json(objetivos)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const encontrarObjetivoGeneral = async (req, res) => {
  try {
    const { id } = req.params
    const objetivo = await Objetivos.findById(id)
    res.status(200).json(objetivo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const modificarObjetivoGeneral = async (req, res) => {
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

const eliminarObjetivoGeneral = async (req, res) => {
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
  crearObjetivoGeneral,
  encontrarObjetivosGenerales,
  encontrarObjetivoGeneral,
  modificarObjetivoGeneral,
  eliminarObjetivoGeneral,
}
