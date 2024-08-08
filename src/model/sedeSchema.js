const mongoose = require('mongoose');

const sedeSchema = new mongoose.Schema({
  iId_Ubigeo: {
    type: String,
    required: false
  },
  iId_Estado: {
    type: String,
    required: true,
    enum: ['Activo', 'Inactivo']
  },
  vNombre: {
    type: String,
    required: true
  },
  vDireccion: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Sede', sedeSchema);
