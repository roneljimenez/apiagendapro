const axios = require('axios');
const qs = require('qs');
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

async function getClientId(email, res){
  try {
    
    const response = await axios.get(`${URL_AGENDAPRO}/clients?search=${email}`, {
      auth: {
        username: AGENDAPRO_USERNAME,
        password: AGENDAPRO_PASSWORD
      }
    });
    //¿Es posible que pueda responder más de uno registro con el mismo correo?
    return response.data[0].id;
  } catch (error) {
    console.error("Error en getClientId:", error.message);
      
      // Si axios devuelve un error de respuesta (por ejemplo, 401, 404, etc.)
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Error en la API de AgendaPro",
          details: error.response.data
        });
      }

      // Si hay otro tipo de error (por ejemplo, timeout o error de conexión)
      res.status(500).json({ error: "Error al obtener id del cliente" });
  }

}

async function getClientBookings(req, res) {

  try {
      // Verifica que las variables de entorno estén definidas
      if (!URL_AGENDAPRO || !AGENDAPRO_USERNAME || !AGENDAPRO_PASSWORD) {
        return res.status(500).json({ error: "Faltan variables de entorno en el servidor" });
      }
      
      if(req.query.search && req.query.search!="") {

        const clientId = await getClientId(req.query.search);
  
        // Realizar la petición a AgendaPro con async/await
        const response = await axios.get(`${URL_AGENDAPRO}/clients/${clientId}/bookings`, {
          auth: {
            username: AGENDAPRO_USERNAME,
            password: AGENDAPRO_PASSWORD
          }
        });
        // Responder con los datos obtenidos
        return res.status(200).json({ bookings: response.data });
      }else{
        return res.status(500).json({ error: "Error al obtener las reservas del cliente" });
      }

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
      res.status(500).json({ error: "Error al obtener las reservas del cliente" });
  }

}

async function modifyClientBook(req, res) {

  try {
    const bookingId = req.params['bookingId'] ? req.params['bookingId'] : "";
    //start: fecha de inicio, end: fecha fin, status_id: estado actual de la reserva
    const { start, end, status_id } = req.body;

    // Datos a enviar
    const data = qs.stringify({
      start: start,
      end: end,
      status_id: status_id
    });
    // Configuración de la solicitud
    const config = {
      method: 'patch',
      url: `${URL_AGENDAPRO}/bookings/${bookingId}`,
      auth: {
        username: AGENDAPRO_USERNAME,
        password: AGENDAPRO_PASSWORD
      },
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };
    
    // Enviar la solicitud
    axios(config)
    .then(response => {
        //console.log('Respuesta:', response.data);
        return res.status(200).json({ response: "Reserva actualizada exitosamente", detail: response.data });
    })
    .catch(error => {
      console.error("Error en modifyClientBook:", error.message);
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Error en la API de AgendaPro",
          details: error.response.data
        });
      }
    });
    

  } catch (error) {
    console.error("Error en modifyClientBook:", error.message);
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Error en la API de AgendaPro",
          details: error.response.data
        });
      }

      // Si hay otro tipo de error (por ejemplo, timeout o error de conexión)
      return res.status(500).json({ error: "Error al actualizar las reserva del cliente" });
  }

}

async function deleteClientBook(req, res) {

  try {
    const bookingId = req.params['bookingId'] ? req.params['bookingId'] : "";
    const response = await axios.delete(`${URL_AGENDAPRO}/bookings/${bookingId}`,{
      auth: {
        username: AGENDAPRO_USERNAME,
        password: AGENDAPRO_PASSWORD
      }
    });
    return res.status(200).json({ response: "Reserva eliminada exitosamente" });

    
  } catch (error) {
    console.error("Error en deleteClientBook:", error.message);
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Error en la API de AgendaPro",
          details: error.response.data
        });
      }

      // Si hay otro tipo de error (por ejemplo, timeout o error de conexión)
      return res.status(500).json({ error: "Error al eliminar la reserva del cliente" });
  }

}

async function createClientBook(req, res) {

  try {
    const { start, end, service_id, provider_id, first_name, last_name, email, phone, identification_number } = req.body;

    // Datos a enviar
    const data = qs.stringify({
      start: start,
      end: end,
      service_id: service_id,
      provider_id: provider_id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      identification_number: identification_number
    });
    // Configuración de la solicitud
    const config = {
      method: 'post',
      url: `${URL_AGENDAPRO}/bookings`,
      auth: {
        username: AGENDAPRO_USERNAME,
        password: AGENDAPRO_PASSWORD
      },
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };
    // Enviar la solicitud
    axios(config)
    .then(response => {
        console.log('Respuesta:', response.data);
        return res.status(200).json({ response: "Reserva creada exitosamente", detail: response.data });
    })
    .catch(error => {
      console.error("Error en createClientBook:", error.message);
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Error en la API de AgendaPro",
          details: error.response.data
        });
      }
    });
    

  } catch (error) {
    console.error("Error en createClientBook:", error.message);
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Error en la API de AgendaPro",
          details: error.response.data
        });
      }

      // Si hay otro tipo de error (por ejemplo, timeout o error de conexión)
      return res.status(500).json({ error: "Error al crear la reserva del cliente" });
  }
  
}
module.exports = {getClients, getClientBookings, getClientId, deleteClientBook, modifyClientBook, createClientBook};