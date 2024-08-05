const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  iId_TipDocumento: {
    type: Number,
    required: false,
    enum: [1, 2, 3, 4, 5],
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
    enum: [1, 2, 3, 4],
  },
  iId_EstadoCivil: {
    type: Number,
    required: false,
    enum: [1, 2, 3, 4, 5],
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
    required: true,
    maxlength: 50,
  },
  vApePaterno: {
    type: String,
    required: true,
    maxlength: 50,
  },
  vApeMaterno: {
    type: String,
    maxlength: 50,
    required: true,
  },
  vNumDocumento: {
    type: String,
    required: true,
    maxlength: 20,
  },
  vNacionalidad: {
    type: String,
    required: true,
  },
  vNumSeguroSocial: {
    type: String,
    maxlength: 20,
    required: false,
  },
  vCelular: {
    type: String,
    maxlength: 15,
    required: true,
  },
  vDireccion: {
    type: String,
    required: true,
  },
  dFechaNacimiento: {
    type: Date,
    required: true,
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
    required: true
  },
  vCorreoTrabajo: { type: String, required: true },
  vCorreoPersonal: { type: String, required: true },
  vDistrito: { type: String, required: true },
  vArea: { type: String, required: true },
  vCargo: { type: String, required: true },
  vRolSistema: { type: String, required: true },
  dFechaIngresoArea: { type: Date, required: true },
  dFechaIngresoEmpresa: { type: Date, required: true },
  vSedeTrabajo: { type: String, required: true },
});

module.exports = mongoose.model('persona', personaSchema);
