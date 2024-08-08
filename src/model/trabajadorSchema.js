const mongoose = require('mongoose');

const trabajadorSchema = new mongoose.Schema({
  vNumDocumento: {
    type: String,
    required: true,
    maxlength: 20,
  },
  vApePaterno: {
    type: String,
    required: true,
    maxlength: 50,
  },
  vApeMaterno: {
    type: String,
    required: true,
    maxlength: 50,
  },
  vNombres: {
    type: String,
    required: true,
    maxlength: 50,
  },
  vDireccion: {
    type: String,
    required: true,
  },
  vDistrito: {
    type: String,
    required: true,
  },
  vCorreoTrabajo: {
    type: String,
    required: true,
  },
  vCorreoPersonal: {
    type: String,
    required: true,
  },
  vNacionalidad: {
    type: String,
    required: true,
  },
  vGenero: {
    type: String,
    required: true,
    enum: ['Masculino', 'Femenino'],
  },
  vEstadoCivil: {
    type: String,
    required: true,
    enum: ['Soltero', 'Casado', 'Divorciado', 'Conviviente', 'Viudo/a'],
  },
  dFechaNacimiento: {
    type: Date,
    required: true,
  },
  vTelefonoPersonal: {
    type: String,
    required: true,
    maxlength: 15,
  },
  vbReconocimientoFacial: {
    type: Buffer,
    required: false,
  },
  vbFirmaDigital: {
    type: Buffer,
    required: false,
  },
  vArea: {
    type: String,
    required: true,
  },
  vCargo: {
    type: String,
    required: true,
  },
  vRolSistema: {
    type: String,
    required: true,
  },
  dFechaIngresoArea: {
    type: Date,
    required: true,
  },
  dFechaIngresoEmpresa: {
    type: Date,
    required: true,
  },
  vStatus: {
    type: String,
    required: true,
  },
  vSedeTrabajo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('trabajador', trabajadorSchema);
