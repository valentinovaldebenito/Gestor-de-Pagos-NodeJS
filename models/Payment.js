const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

//Modelo del Pago
const Pago = sequelize.define("Pago", {
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  metodoPago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  monto: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  comprobante: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Pago;
