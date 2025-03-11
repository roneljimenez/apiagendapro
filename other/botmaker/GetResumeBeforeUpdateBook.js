const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const slotSelected = user.get('test_slot_selected');
const slotDate = user.get(`test_book_slot_${slotSelected}_id`);
const hourSelected = user.get('test_hour_selected');
const slotHour = user.get(`test_book_start_hour_${hourSelected}_id`);
const date = new Date(slotHour);
const hours = date.getUTCHours();  // Hora en UTC
const minutes = date.getUTCMinutes(); // Minutos en UTC
const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};


const main = async () => {
    OUTPUTS.log(`Has seleccionado: Fecha: ${slotDate} en el horario: ${hours}:${minutes}. ¿Están los datos correctos? `);
};
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);
