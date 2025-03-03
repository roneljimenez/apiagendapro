const express = require("express");
const { validateToken } = require("./middleware");
const { getClients,  getClientBookings } = require("./controllers");

const router = express.Router();
//asi es con validacion de JWT, de momento lo dejaremos abierto para efectos de pruebas de desarrollo
//router.get("/clients", validateToken, getClients);

//Rutas abiertas
//Obtiene lista de clientes
router.get("/clients", getClients);

router.get("/client/:id/bookings", getClientBookings);


module.exports = router;