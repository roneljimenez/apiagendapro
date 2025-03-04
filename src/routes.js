const express = require("express");
const { validateToken } = require("./middleware");
const { getClients,  getClientBookings, getClientId } = require("./controllers");

const router = express.Router();
//asi es con validacion de JWT, de momento lo dejaremos abierto para efectos de pruebas de desarrollo
//router.get("/clients", validateToken, getClients);

//Rutas abiertas
//Obtiene lista de clientes
router.get("/clients", getClients);

//obtiene el id de un cliente
router.get("/getClientId/", getClientId);

//obtiene las reservas de un cliente
router.get("/client/bookings/", getClientBookings);

module.exports = router;