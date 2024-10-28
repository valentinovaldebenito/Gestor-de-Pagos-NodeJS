const cors = require("cors");
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Guarda el archivo en memoria como buffer
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); //Importamos el paquete que nos permite encriptar las contraseñas
const bodyParser = require("body-parser");
const User = require("./models/User"); // Importamos el modelo de usuario
const Payment = require("./models/Payment"); // Importamos el modelo de pago
const sequelize = require("./database/db"); // Importamos la conexión a la base de datos
const verifyToken = require("./middlewares/verifyToken"); //Middleware para verificar que el token sea valido y nos permita hacer las consultas
const isRoleValid = require("./middlewares/roleMiddleware"); //Middleware para verificar si el usuario logueado puede cargar el rol que intenta cargar
const Pago = require("./models/Payment");
const PORT = 4250;
let revokedTokens = []; // Podrías usar una tabla en MySQL o Redis para esto

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Solo permite solicitudes desde el cliente
  })
);

//Sincronización con la base de datos
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Servidor corriendo en el puerto: " + PORT);
    });
  })
  .catch((error) => {
    console.log("Error al sincronizar el modelo de usuario: " + error);
  });

// Endpoint para obtener todos los usuarios
app.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "nombre", "password", "rol", "email"] }); // Puedes especificar los atributos que quieres devolver
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

//Ruta para registrar usuarios
app.post("/register-user", verifyToken, isRoleValid, async (req, res) => {
  const { nombre, password, email, rol, currentRol } = req.body;

  if (!isRoleValid) {
    try {
      // Encripta la contraseña
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Crea un nuevo usuario
      const user = await User.create({ nombre, password: hashedPassword, email, rol });
      res.status(201).json({ message: "Usuario creado exitosamente", user: user });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      res.status(500).json({ message: "Error al crear usuario" });
    }
  } else {
    res.status(403).json({ message: `No tiene permisos para realizar esa acción, currentRol: ${typeof(currentRol)}` });
  }
});

//Ruta para loguearse
app.post("/login", async (req, res) => {
  const { nombre, password } = req.body;

  try {
    // Busca al usuario en la base de datos
    const user = await User.findOne({ where: { nombre } });

    if (!user) {
      return res.status(401).json({ message: "Usuario incorrecto" });
    }

    // Compara la contraseña
    /* const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    } */

    // Genera un JWT
    const token = jwt.sign({ userId: user.id }, "tu_secreto", { expiresIn: "1h" });

    res.json({ token: token, user: user });
  } catch (error) {
    console.error("Error al loguearse:", error);
    res.status(500).json({ message: "Error al loguearse" });
  }
});

//Endpoint para cerrar la sesión y revocar el Token
app.post("/logout", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1]; // Si envías el token en el header 'Authorization'

  // Guarda el token en la lista de tokens revocados
  revokedTokens.push(token);
  res.json({ message: "Logout exitoso" });
});

//Ruta para cargar pagos
app.post("/pagos", upload.single("comprobante"), async (req, res) => {
  try {
    const { fechaPago, metodoPago, descripcion, monto, activo } = req.body;
    const comprobante = req.file ? req.file.buffer : null;

    const newPago = await Payment.create({ fechaPago, metodoPago, descripcion, monto, activo, comprobante });

    res.status(201).json(newPago);
  } catch {
    res.status(500).json({ error: "Error al cargar el pago" });
  }
});

//Ruta que devuelve la info de los pagos cargados verificando el token
app.get("/pagos", verifyToken, async (req, res) => {
  try {
    const pagos = await Pago.findAll({ attributes: ["id", "fechaPago", "metodoPago", "descripcion", "monto", "createdAt"] }); // Puedes especificar los atributos que quieres devolver
    res.json(pagos);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).json({ message: "Error al obtener pagos" });
  }
});
