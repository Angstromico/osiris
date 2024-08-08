const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  iId_TipDocumento: {
    type: Number,
    required: false,
    enum: [1, 2, 3, 4, 5], 
  },
  vEmail: {
    type: String,
    required: true,
  },
  iId_GeneroPersona: {
    type: Number,
    required: false,
  },
  iId_NivelEstudio: {
    type: Number,
    required: false,
  },
  iId_Ubigeo: {
    type: Number,
    required: false,
  },
  iId_Estado: {
    type: Number,
    required: false,
    enum: [1, 2, 3, 4], // Assuming IDs map to valid states
  },
  iId_EstadoCivil: {
    type: Number,
    required: false,
    enum: [1, 2, 3, 4, 5], // Assuming IDs map to civil states
  },
  iId_TipSegMedico: {
    type: Number,
    required: false,
  },
  iId_SistPension: {
    type: Number,
    required: false,
  },
  vActaNacimiento: {
    type: String,
    required: false,
  },
  vComprobanteDomicilio: {
    type: String,
    required: false,
  },
  vCodigoSegMedico: {
    type: String,
    maxlength: 50,
    required: false,
  },
  vNombre: {
    type: String,
    required: false,
    maxlength: 50,
  },
  vApePaterno: {
    type: String,
    required: false,
    maxlength: 50,
  },
  vApeMaterno: {
    type: String,
    maxlength: 50,
    required: false,
  },
  vNumDocumento: {
    type: String,
    required: false,
    maxlength: 20,
  },
  vNacionalidad: {
    type: String,
    required: false,
  },
  vNumSeguroSocial: {
    type: String,
    maxlength: 20,
    required: false,
  },
  vCelular: {
    type: String,
    maxlength: 15,
    required: false,
  },
  vDireccion: {
    type: String,
    required: false,
  },
  dFechaNacimiento: {
    type: Date,
    required: false,
  },
  dFechaIngreso: {
    type: Date,
    required: false,
  },
  vbFacial: {
    type: Buffer,
    required: false,
  },
  vbFirmaDigital: {
    type: Buffer,
    required: false,
  },
  dFechaRegistro: { type: Date, default: Date.now, required: true },
  companyAreas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'personArea'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required:true
  },
  
});

module.exports = mongoose.model('persona', personaSchema);
