const mongoose = require('mongoose')

const ObjetivosSchema = mongoose.Schema(
  {
    generales: { type: String, required: true },
    especificos: {
      type: [String],
      required: true,
    },
    contenido: {
      type: [
        {
          meta: { type: String, required: true },
          indicador: { type: String, required: true },
          formula: { type: String, required: true },
          frecuencia: { type: String, required: true },
          responsabilidad: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const objetivos = mongoose.model('Objetivos', ObjetivosSchema)

module.exports = objetivos
