const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const slotSelected = user.get('test_slot_selected');
const slotDate = new Date(user.get(`test_book_slot_${slotSelected}_id`));
const formatedSlotDate = new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(slotDate);
const hourSelected = user.get('test_hour_selected');
const provider_name = user.get(`test_book_provider_name_${hourSelected}_id`);
const slotHour = user.get(`test_book_start_hour_${hourSelected}_id`);
const date = new Date(slotHour);
const hours = date.getUTCHours();  // Hora en UTC
const minutes = date.getUTCMinutes(); // Minutos en UTC
const serviceSelected = user.get("test_service_selected");
const service_id = user.get(`test_service_${serviceSelected}_id`);
const service_name = user.get(`test_service_name_${serviceSelected}_id`);
const location_id = "84887";

const clientInfo = {
  name : user.get("test_book_client_name"),
  lastName : user.get("test_book_client_last_name"),
  email : user.get("test_client_email"),
  phone : user.get("test_book_client_phone"),
  rut : user.get("test_book_client_rut")
};



const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};


const main = async() => {
   OUTPUTS.log(`\n Has seleccionado: \n 
   ${service_name}.\n 
   Fecha: ${formatedSlotDate} en el horario: ${hours}:${minutes}.\n 
   Profesional: ${provider_name}\n 
   Nombre y Apellido: ${clientInfo.name} ${clientInfo.lastName}\n
   Email: ${clientInfo.email}\n
   Teléfono: ${clientInfo.phone}\n
   Rut:  ${clientInfo.rut}\n
   ¿Están los datos correctos? `);
};

main()
    .catch(err => {
        // Code on error
        const errorMessage = `[User Basic Template] Error - ${context.userData._id_} - ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);