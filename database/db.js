const { Sequelize } = require("sequelize");

//Configuracion de Sequelize con los datos de la Dase de Datos
const sequelize = new Sequelize("gestorpagos", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

module.exports = sequelize;
