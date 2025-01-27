const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro de administrador
router.post('/register', async (req, res) => {
    const { nombre, apellidos, telefono, email, direccion, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await User.create({
            nombre,
            apellidos,
            telefono,
            email,
            direccion,
            password: hashedPassword,
            rol: 'admin',
        });
        res.status(201).json({ mensaje: 'Administrador registrado', admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || user.rol !== 'admin') {
            return res.status(401).json({ mensaje: 'No autorizado' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
