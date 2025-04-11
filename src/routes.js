const express = require("express");
const { validateToken } = require("./middleware");
const { getClients, getClientInfo,  getClientBookings, getClientId, deleteClientBook, modifyClientBook, createClientBook, getAvailableSlots, getAvailableSlotsByServiceByProvider, getAvailableHours, getServicesCategories, getServices } = require("./controllers");

const router = express.Router();
//asi es con validacion de JWT, de momento lo dejaremos abierto para efectos de pruebas de desarrollo
//router.get("/clients", validateToken, getClients);

//Rutas abiertas

//Información de servicios
//obtiene las categorias de los servios
router.get("/services/categories", getServicesCategories);
//obtiene los servicios por categoría
router.get("/services/", getServices);

//Información clientes
//Obtiene lista de clientes
//router.get("/clients", getClients);

//obtiene información guardada de clientes
router.get("/client/", getClientInfo);

//obtiene el id de un cliente
router.get("/getClientId/", getClientId);

//obtiene las reservas de un cliente
router.get("/client/bookings/", getClientBookings);

//Gestión de reservas

//crea la reserva de un cliente
router.post("/client/bookings/", createClientBook);

//modifica una reserva
router.patch("/client/bookings/:bookingId", modifyClientBook);

//elimina o cancela una reserva
router.delete("/client/bookings/:bookingId", deleteClientBook);

//obtiene fechas disponibles
router.get("/slots", getAvailableSlots);

//obtiene fechas disponibles por proveedor por servicio
router.get("/slots/provider", getAvailableSlotsByServiceByProvider);

//obtiene fechas disponibles
router.get("/slots/hours", getAvailableHours);

module.exports = router;