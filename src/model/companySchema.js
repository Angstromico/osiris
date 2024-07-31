const mongoose = require('mongoose');


const companySchema = new mongoose.Schema({
  iId_Estado: { type: Number, required: false },
  iId_TipDocumento: { type: Number, required: false },
  vNumDocumento: { type: String, required: true, unique: true },
  vNombre: { type: String, required: true },
  vContacto: { type: String },
  vDireccion: { type: String },
  dFechaRegistro: { type: Date, default: Date.now },
  vEmail: { type: String, required: true, unique: true },
  iso: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companyIso',
    required: false
  }],
  companyArea: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companyArea',
    required: false
  }],
  pais: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pais',
    required: true
  }],
  sede:  [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sede',
    required: false
  }],
  companyEconomicActivity:  [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companyEconomicActivity',
    required: false
  }],
  ruc: { type: String, unique: true, required: true },
  razonSocial: { type: String, required: true },
  correoEmpresa: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  ciudad: { type: String, required: true },
  tamanoEmpresa: { type: Number, required: true }, // 1: Pequeña, 2: Mediana, 3: Grande, 4: Micro Empresa
  actividadEconomica: { type: String, required: true }

});


module.exports = mongoose.model('Company', companySchema, 'company');