const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const smsRoutes = require('./routes/sms');

dotenv.config();

const app = express();
app.use(express.json());

// Probar la conexión a la base de datos
sequelize.authenticate()
    .then(() => console.log('Conexión a MySQL establecida.'))
    .catch(err => console.error('No se pudo conectar a la base de datos:', err));

const PORT = process.env.PORT || 5522;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

const User = require('./models/User');
sequelize.sync({ force: false })
    .then(() => console.log('Modelos sincronizados con la base de datos.'))
    .catch(err => console.error('Error al sincronizar los modelos:', err));


app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/sms', smsRoutes);