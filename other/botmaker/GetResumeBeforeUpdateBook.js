const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const slotSelected = user.get('test_slot_selected');
const slotDate = new Date(user.get(`test_book_slot_${slotSelected}_id`));
const formatedSlotDate = new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(slotDate);
const hourSelected = user.get('test_hour_selected');
const slotHour = user.get(`test_book_start_hour_${hourSelected}_id`);
const date = new Date(slotHour);
const hours = date.getUTCHours();  // Hora en UTC
const minutes = date.getUTCMinutes(); // Minutos en UTC
const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};


const main = async () => {
    OUTPUTS.log(`\n Has seleccionado: \n Fecha: ${formatedSlotDate} en el horario: ${hours}:${minutes}.\n ¿Están los datos correctos? `);
};
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);
