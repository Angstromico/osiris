const extintor = require('../model/extintorSchema')
const tipoExtintor = require('../model/tipoextintorSchema')
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const postExtintor = async (req, res) => {
    const client = await MongoClient.connect(
        process.env.URI
    );

    try{
        await client.connect();
        const newExtintor = new extintor({
            vCodigo : req.body.vCodigo,
            vNroExtintor: req.body.vNroExtintor,
            iId_SedeEmpresa: req.body.iId_SedeEmpresa,
            iId_AreaEmpresa: req.body.iId_AreaEmpresa,
            iId_TipoExtintor: req.body.iId_TipoExtintor
        })
        const coll = client.db('isoDb').collection('extintor')
        const result = await coll.insertOne(newExtintor);
        console.log(`New Extintor inserted with ID: ${result.insertedId}`);
        res.status(201).json({ message: 'Extintor created successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }finally{
        await client.close();
    }
}

const postTipoExtintor = async (req, res) =>{
    const client = await MongoClient.connect(
        process.env.URI
    );
    await client.connect();
        
        const newTipoExtintor = new tipoExtintor({
            vUnidad: req.body.vUnidad,
            vNombre: req.body.vNombre
        })
        

        const coll = client.db('isoDb').collection('tipo_extintor')
        const result = await coll.insertOne(newTipoExtintor);
        console.log(`New Type Extintor inserted with ID: ${result.insertedId}`);
        res.status(201).json({ message: 'Type Extintor created successfully' });

}

const getExtintor = async (req, res)=>{
    const client = await MongoClient.connect(
        process.env.URI
    );
    try{
        await client.connect();
        const filter = {};
        const extintores = client.db('isoDb').collection('extintor');
        const cursor = extintores.find(filter);
        const data = await cursor.toArray();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Error al realizar la búsqueda"
        });
    }finally{
      await client?.close();
    }
}

const getTipoExtintor = async (req, res) =>{
    const client = await MongoClient.connect(
        process.env.URI
    );
    try{
        await client.connect();
        const filter = {};
        const tipo_extintores = client.db('isoDb').collection('tipo_extintor');
        const cursor = tipo_extintores.find(filter);
        const data = await cursor.toArray();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Error al realizar la búsqueda"
        });
    }
    finally{
      await client?.close();
    }
}

const updateExtintor = async (req, res) =>{
    const client = await MongoClient.connect(
        process.env.URI
      );

    try{
        await client.connect();
        const db = client.db('isoDb');
        const collection = db.collection('extintor');
        const extintorId = req.params.id; 
        const updatedExtintor = req.body;
        const filter = { _id: new ObjectId(extintorId) }; 
        await collection.findOneAndUpdate(
            filter,
            { $set: updatedExtintor },
            { returnDocument: 'after' } 
          );
        res.status(200).json({ message: 'Extintor updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        await client?.close(); 
    }
}

const updateTipoExtintor =async (req, res) => {
    const client = await MongoClient.connect(
        process.env.URI
      );

    try{
        await client.connect();
        const db = client.db('isoDb');
        const collection = db.collection('tipo_extintor');
        const tipoextintorId = req.params.id; 
        const updatedTipoExtintor = req.body;
        const filter = { _id: new ObjectId(tipoextintorId) }; 
        await collection.findOneAndUpdate(
            filter,
            { $set: updatedTipoExtintor },
            { returnDocument: 'after' } 
          );
        res.status(200).json({ message: 'Type Extintor updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        await client?.close(); 
    }
}


const listExtintorVencimiento = async (req, res) =>{
    try{
        const fechaCorte = new Date();
        fechaCorte.setFullYear(fechaCorte.getFullYear() - 20);
        const extintores = await Extintor.find({
            vfechaFabricacion: { $lt: fechaCorte }
        });
        res.status(200).json(extintores);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally{
        await client?.close(); 
    }
}


module.exports = {
    postExtintor,
    postTipoExtintor,
    getExtintor,
    getTipoExtintor,
    updateExtintor,
    updateTipoExtintor,
    listExtintorVencimiento

}