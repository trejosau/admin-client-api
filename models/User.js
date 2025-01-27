const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    direccion: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.ENUM('admin', 'cliente'), defaultValue: 'cliente' },
    password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = User;