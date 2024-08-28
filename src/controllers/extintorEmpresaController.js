const express = require('express');
const router = express.Router();

const extintorService = require('../services/extintorEmpresaService')

router.post('/extintor', async (req, res) => {
    try {
      await extintorService.postExtintor(req, res);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
});

router.post('/tipo', async (req, res) => {
    try {
      await extintorService.postTipoExtintor(req, res);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  });

router.get('/extintor', async (req, res) => {
    try {
      await extintorService.getExtintor(req, res);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
});

router.get('/tipo', async (req, res) => {
    try {
      await extintorService.getTipoExtintor(req, res);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  });

router.put('extintor/:id', async (req, res) => {
    try {
      await extintorService.updateExtintor(req, res);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error  : error.message });
    }
});
  
router.put('tipoextintor/:id', async (req, res) => {
    try {
      await extintorService.updateTipoExtintor(req, res);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error  : error.message });
    }
});

router.get('extintorVencido', async(req, res) =>{
  try{
    await extintorService.listExtintorVencimiento(req, res);
  }catch (error) {
    res.status(error.statusCode || 500).json({ error  : error.message });
  }
})


module.exports = router;