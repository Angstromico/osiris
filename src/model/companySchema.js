const mongoose = require('mongoose');


const companySchema = new mongoose.Schema({
  iId_Estado: { type: Number, required: false },
  iId_TipDocumento: { type: Number, required: false },
  vNumDocumento: { type: String, required: true, unique: true },
  vNombre: { type: String, required: true },
  vContacto: { type: String },
  vDireccion: { type: String },
  vCiudad: { type: String, required: true },
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
  vRuc: { type: String, unique: true, required: true },
  vRazonSocial: { type: String, required: true },
  vCorreoEmpresa: { type: String, required: true, unique: true },
  vContrasena: { type: String, required: true },
  tamanoEmpresa: { type: Number, required: true }, // 1: Pequeña, 2: Mediana, 3: Grande, 4: Micro Empresa
  vActividadEconomica: { type: String, required: true }

});


module.exports = mongoose.model('Company', companySchema, 'company');