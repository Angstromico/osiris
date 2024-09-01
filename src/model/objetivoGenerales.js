const mongoose = require('mongoose')

const ObjetivosGeneralesSchema = mongoose.Schema({
  objetivoGeneral: {
    type: String,
    required: true, // Campo requerido
  },
  objetivosEspecificos: [
    {
      titulo: {
        type: String,
        required: true, // Campo requerido
      },
      meta: {
        type: String,
        required: true, // Campo requerido
      },
      responsable: {
        type: String,
        required: true, // Campo requerido
      },
      area: {
        type: String,
        required: true, // Campo requerido
      },
      programa: {
        type: String,
        required: true, // Campo requerido
      },
      fechas: [
        {
          dia: {
            type: Number,
            min: 1,
            max: 31,
            required: true, // Campo requerido
            validate: [
              {
                validator: Number.isInteger,
                message: (props) => `${props.value} debe ser un número entero.`,
              },
              {
                validator: function (v) {
                  const mes = this.mes
                  const diasEnMes = [
                    31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
                  ]
                  return v <= diasEnMes[mes - 1]
                },
                message: (props) =>
                  `El día ${props.value} no es válido para el mes seleccionado.`,
              },
            ],
          },
          mes: {
            type: Number,
            min: 1,
            max: 12,
            required: true, // Campo requerido
            validate: {
              validator: Number.isInteger,
              message: (props) => `${props.value} debe ser un número entero.`,
            },
          },
        },
      ],
    },
  ],
})

const objetivosGenerales = mongoose.model('Objetivos', ObjetivosGeneralesSchema)

module.exports = objetivosGenerales
