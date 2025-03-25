const axios = require('axios');
const qs = require('qs');
const { DateTime } = require('luxon');
const Client = require("./models");

//Valores de entorno
const URL_AGENDAPRO = process.env.URL_AGENDAPRO;
const AGENDAPRO_USERNAME = process.env.AGENDAPRO_USERNAME;
const AGENDAPRO_PASSWORD = process.env.AGENDAPRO_PASSWORD;

async function getServicesCategories(req, res) {
  try {
    const { location_id } = req.query;
    if(location_id != ""){
      const response = await axios.get(`${URL_AGENDAPRO}/locations/${location_id}/services`, {
        auth: {
          username: AGENDAPRO_USERNAME,
          password: AGENDAPRO_PASSWORD
        }
      });
      const services = response.data;
      const uniqueCategories = [...new Set(services.map(s => s.category))];
        return res.status(200).json({categories: uniqueCategories});
    }else{
      return res.status(400).json({ error: 'Debe proporcionar una locación' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener las categorías' });
  }
  
}

const getServiceDescription = async (id) => {
  try {
      const response = await axios.get(`${URL_AGENDAPRO}/services/${id}`, {
        auth: {
          username: AGENDAPRO_USERNAME,
          password: AGENDAPRO_PASSWORD
        }
      });

      //error de tipeo de la api de agendapro devuelve decription sin la s
      return response.data.decription;
  } catch (error) {
      console.error(`Error obteniendo descripción para el ID ${id}:`, error.message);
      return "Descripción no disponible";
  }
};

const enrichServicesWithDescription = async (services) => {
  const enrichedServices = await Promise.all(
      services.map(async (service) => {
          const description = await getServiceDescription(service.id);
          return { ...service, description }; // Agregar la descripción al objeto original
      })
  );

  return enrichedServices;
};

async function getServices(req, res) {
  try {
    const { location_id, category } = req.query;
    if(location_id != "" && category !=""){
      const response = await axios.get(`${URL_AGENDAPRO}/locations/${location_id}/services`, {
        auth: {
          username: AGENDAPRO_USERNAME,
          password: AGENDAPRO_PASSWORD
        }
      });
      const services = response.data;
      const filteredServices = services.filter(s => 
        s.category === category && 
        !/(sesiones|tratamiento|plan)/i.test(s.name)
      );
      const servicesWithDescriptions = await enrichServicesWithDescription(filteredServices);
      return res.status(200).json({services: servicesWithDescriptions});
    }else{
      return res.status(500).json({ error: 'Debe proporcionar locación y categoría de servicio' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener las categorías' });
  }
  
}

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
        //Filtra las reservas para devolver las que sean distinto a 5=canceladas, 6=no asistira
        const filteredBookings = response.data.filter(booking => booking.status_id !== 5 && booking.status_id !== 6);
        // Responder con los datos obtenidos
        return res.status(200).json({ bookings: filteredBookings });
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

async function getAvailableSlots(req, res) {
  try {
    const { service_id, location_id } = req.query;
    if (!service_id || !location_id) {
      return res.status(400).json({ error: "Se requieren service_id y location_id" });
    }
    let date = DateTime.now().startOf('day');
    const availableSlots = [];
    let daysChecked = 0;
    
    while (availableSlots.length < 4 && daysChecked < 30) { // Límite de 30 días para evitar bucles infinitos
        const formattedDate = date.toISODate();
        
        try {
            const response = await axios.get(`${URL_AGENDAPRO}/services/${service_id}/available_hours`, {
                params: { location_id, date: formattedDate },
                auth: {
                  username: AGENDAPRO_USERNAME,
                  password: AGENDAPRO_PASSWORD
                }
            });
            
            if (response.data.available_hours && response.data.available_hours.length > 0) {
                //asi si quisera responder de una vez las horas disponibles por día, para eficiendia de memoria de las variables y escalabilidad en botmaker no es recomendable responder todo junto
                //availableSlots.push({ date: formattedDate, hours: response.data.available_hours });

                //lo dejaremos asi, devolviendo primero las fechas disponibles para que cliente seleccione y luego le devolveremos en otro endpoint las horas de ese día
                availableSlots.push({ date: formattedDate });
            }
        } catch (error) {
            console.error(`Error al consultar la API para la fecha ${formattedDate}:`, error.message);
        }

        date = date.plus({ days: 1 });
        daysChecked++;
    }

    if (availableSlots.length === 0) {
      return res.status(404).json({ error: "No se encontraron horarios disponibles" });
    }

    return res.status(200).json({slots:availableSlots});

  } catch (error) {
    console.error("Error en getAvailableSlots:", error.message);
      
    // Si axios devuelve un error de respuesta (por ejemplo, 401, 404, etc.)
    if (error.response) {
      return res.status(error.response.status).json({
        error: "Error en la API de AgendaPro",
        details: error.response.data
      });
    }

    // Si hay otro tipo de error (por ejemplo, timeout o error de conexión)
    res.status(500).json({ error: "Error al obtener fechas disponibles" });
  }
}

async function getAvailableHours(req, res) {
  try {

    const { service_id, location_id, date } = req.query;
    if (!service_id || !location_id || !date) {
      return res.status(400).json({ error: "Se requieren service_id, location_id y date" });
    }

    const response = await axios.get(`${URL_AGENDAPRO}/services/${service_id}/available_hours`, {
        params: { location_id, date },
        auth: {
          username: AGENDAPRO_USERNAME,
          password: AGENDAPRO_PASSWORD
        }
    });

    if(response.data.available_hours && response.data.available_hours.length > 0){
      return res.status(200).json({available_hours: response.data.available_hours});
    }

    return res.status(404).json({ error: "No se encontraron horarios disponibles" });
    
  } catch (error) {
    console.error("Error en getAvailableHours:", error.message);
      
    // Si axios devuelve un error de respuesta (por ejemplo, 401, 404, etc.)
    if (error.response) {
      return res.status(error.response.status).json({
        error: "Error en la API de AgendaPro",
        details: error.response.data
      });
    }

    // Si hay otro tipo de error (por ejemplo, timeout o error de conexión)
    res.status(500).json({ error: "Error al obtener horas disponibles" });
  }
}

module.exports = {getClients, getClientBookings, getClientId, deleteClientBook, modifyClientBook, createClientBook, getAvailableSlots, getAvailableHours, getServicesCategories, getServices};