const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const formatedSlotDate = JSON.parse(user.get('test_slot_selected')).name;
const hourSelected = JSON.parse(user.get('test_hour_selected'));
const provider_name = hourSelected.providerName;
const slotHour = hourSelected.name;
const service_id = JSON.parse(user.get("test_service_selected")).idService;
const service_name = JSON.parse(user.get("test_service_selected")).name;
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
   Fecha: ${formatedSlotDate} en el horario: ${slotHour}.\n 
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