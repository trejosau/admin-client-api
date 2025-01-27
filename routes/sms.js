const express = require('express');
const { sendSMS } = require('../services/smsService');
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// Ruta para enviar un SMS
router.post('/send-sms/:email', verifyToken, async (req, res) => {
    const { email } = req.params;
    const { message: smsMessage } = req.body;

    try {
        // Verificar que el cliente esté autorizado a enviar SMS
        const cliente = await User.findOne({ where: { email } });

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const number = cliente.telefono;

        // Enviar el SMS
        const response = await sendSMS(number, smsMessage);
        console.log(response);

        res.status(200).json({ mensaje: 'SMS enviado exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al enviar el SMS', error: error.message });
    }
});



module.exports = router;
