//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_available_slots';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const serviceSelected = user.get("test_service_selected");
const service_id = user.get(`test_service_${serviceSelected}_id`);
const location_id = "84887";

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/slots?service_id=${service_id}&location_id=${location_id}`,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": AUTHENTICATION,
        },
    });
};

const main = async() => {
    const response = await callServiceApiRest();
  	const available_slots = response.slots;

  	if(available_slots.length > 0) {
    	let options = "";
      	available_slots.forEach((slot, index) => {
          const fecha = new Date(slot.date);
		  const fechaFormateada = new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(fecha);
        	options += `\n ${index + 1}. Fecha: ${fechaFormateada}, \n`;
            user.set(`test_book_slot_${index + 1}_id`, slot.date);
        });
      OUTPUTS.log(`opciones: ${options}`); // Success log
      user.set(BM_RESULT_VAR_NAME, options);
    }else{
      user.set(BM_RESULT_VAR_NAME, "No hay fechas disponibles.");
    }
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  Error - ${CUSTOMER_ID} - ${err.message}`;
        user.set('ca_error', errorMessage);
        OUTPUTS.log(errorMessage);
    })
    .finally(result.done);