const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/qr-data/:id', (req, res) => {
  const userId = req.params.id;

  // Aquí simulas los datos de la BD, puede ser Firebase en producción
  const datos = {
    nombre: 'Ricardo',
    email: 'ricardo@correo.com',
    id: userId,
    timestamp: new Date().toISOString()
  };

  res.json(datos);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
