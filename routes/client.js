const express = require('express');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Crear cliente
router.post('/', verifyToken, async (req, res) => {
    // Verificar si el usuario autenticado es un administrador
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Acción no autorizada' });
    }

    const { nombre, apellidos, telefono, email, direccion } = req.body;

    try {
        // Crear un nuevo cliente en la base de datos
        const cliente = await User.create({
            nombre,
            apellidos,
            telefono,
            email,
            direccion,
            rol: 'cliente',
            password: 'clienteDefault123',
        });

        // Enviar una respuesta exitosa con los datos del cliente creado
        res.status(201).json({
            mensaje: 'Cliente creado exitosamente',
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellidos: cliente.apellidos,
                telefono: cliente.telefono,
                email: cliente.email,
                direccion: cliente.direccion,
                rol: cliente.rol,
            },
        });
    } catch (error) {
        // Manejar errores, como violaciones de restricciones únicas
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
        }
        // Responder con un error genérico en caso de otros fallos
        res.status(500).json({ mensaje: 'Error al crear el cliente', error: error.message });
    }
});

router.put('/:email', verifyToken, async (req, res) => {
    const { email } = req.params;
    const { nombre, apellidos, telefono, direccion } = req.body;

    try {
        // Buscar al cliente por correo electrónico
        const cliente = await User.findOne({ where: { email } });

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        // Actualizar los datos del cliente
        cliente.nombre = nombre || cliente.nombre;
        cliente.apellidos = apellidos || cliente.apellidos;
        cliente.telefono = telefono || cliente.telefono;
        cliente.direccion = direccion || cliente.direccion;

        await cliente.save();

        res.status(200).json({ mensaje: 'Cliente actualizado exitosamente', cliente });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el cliente', error: error.message });
    }
});

module.exports = router;
