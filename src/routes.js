const express = require("express");
const { validateToken } = require("./middleware");
const { getClients,  getClientBookings, getClientId, deleteClientBook, modifyClientBook, createClientBook, getAvailableSlots, getAvailableHours } = require("./controllers");

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

//crea la reserva de un cliente
router.post("/client/bookings/", createClientBook);

//modifica una reserva
router.patch("/client/bookings/:bookingId", modifyClientBook);

//elimina o cancela una reserva
router.delete("/client/bookings/:bookingId", deleteClientBook);

//obtiene fechas disponibles
router.get("/slots", getAvailableSlots);

//obtiene fechas disponibles
router.get("/slots/hours", getAvailableHours);

module.exports = router;