// backend-node/index.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = 3000;

app.use(cors());

const serviceAccount = require('./firebaseKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gymbd-386cc.firebaseio.com"
});

const db = admin.firestore();

app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const doc = await db.collection('usuarios').doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const userData = doc.data();
    const payload = {
      nombre: userData.nombre,
      email: userData.email,
      timestamp: new Date().toISOString()  
    };

    res.json(payload);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor API corriendo en puerto ${PORT}`);
});
