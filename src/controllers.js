const axios = require('axios');
const Client = require("./models");

//Valores de entorno
const URL_AGENDAPRO = process.env.URL_AGENDAPRO;
const AGENDAPRO_USERNAME = process.env.AGENDAPRO_USERNAME;
const AGENDAPRO_PASSWORD = process.env.AGENDAPRO_PASSWORD;


async function getClients(req, res) {

  try {
      // Verifica que las variables de entorno estén definidas
      if (!URL_AGENDAPRO || !AGENDAPRO_USERNAME || !AGENDAPRO_PASSWORD) {
        return res.status(500).json({ error: "Faltan variables de entorno en el servidor" });
      }

      // Realizar la petición a AgendaPro con async/await
      const response = await axios.get(`${URL_AGENDAPRO}/clients`, {
        auth: {
          username: AGENDAPRO_USERNAME,
          password: AGENDAPRO_PASSWORD
        }
      });
      // Responder con los datos obtenidos
      return res.json({ success: response.data });
      //Mientras se aplica la llave de seguridad se cierra la verdadera respuesta
      //return res.json({ success: "Jose Calveti" });

  } catch (error) {
      console.error("Error en getClients:", error.message);
      
      // Si axios devuelve un error de respuesta (por ejemplo, 401, 404, etc.)
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Error en la API de AgendaPro",
          details: error.response.data
        });
      }

      // Si hay otro tipo de error (por ejemplo, timeout o error de conexión)
      res.status(500).json({ error: "Error al obtener los clientes" });
  }

}

async function getClientBookings(req, res) {

  try {
      // Verifica que las variables de entorno estén definidas
      if (!URL_AGENDAPRO || !AGENDAPRO_USERNAME || !AGENDAPRO_PASSWORD) {
        return res.status(500).json({ error: "Faltan variables de entorno en el servidor" });
      }
      const clientId = req.params.id ? req.params.id : "";

      // Realizar la petición a AgendaPro con async/await
      const response = await axios.get(`${URL_AGENDAPRO}/clients/${clientId}/bookings`, {
        auth: {
          username: AGENDAPRO_USERNAME,
          password: AGENDAPRO_PASSWORD
        }
      });
      // Responder con los datos obtenidos
      return res.json({ data: response.data });

  } catch (error) {
      console.error("Error en getClientBookings:", error.message);
      
      // Si axios devuelve un error de respuesta (por ejemplo, 401, 404, etc.)
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Error en la API de AgendaPro",
          details: error.response.data
        });
      }

      // Si hay otro tipo de error (por ejemplo, timeout o error de conexión)
      res.status(500).json({ error: "Error al obtener los clientes" });
  }

}

module.exports = {getClients, getClientBookings};