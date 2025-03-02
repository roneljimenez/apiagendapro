const express = require("express");
const { validateToken } = require("./middleware");
const { getClients } = require("./controllers");

const router = express.Router();
//asi es con validacion de JWT, de momento lo dejaremos abierto para efectos de pruebas de desarrollo
//router.get("/clients", validateToken, getClients);

//Rutas abiertas
router.get("/clients", getClients);

module.exports = router;