const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

//Modelo del Usuario
const User = sequelize.define("User", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = User;
