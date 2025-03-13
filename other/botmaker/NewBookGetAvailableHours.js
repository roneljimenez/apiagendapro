//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_available_hours';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const slotSelected = user.get('test_slot_selected');
const serviceSelected = user.get("test_service_selected");
const service_id = user.get(`test_service_${serviceSelected}_id`);
const location_id = "84887";
const date = user.get(`test_book_slot_${slotSelected}_id`);

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/slots/hours?service_id=${service_id}&location_id=${location_id}&date=${date}`,
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
  	const available_hours = response.available_hours ? response.available_hours : "" ;
  	if(available_hours.length > 0) {
    	let options = "";
      	available_hours.forEach((hour, index) => {
        	options += `\n ${index + 1}. Hora: ${hour.start_block}, \n Profesional: ${hour.provider_name} \n`;
            user.set(`test_book_start_hour_${index + 1}_id`, hour.start_time);
          	user.set(`test_book_end_hour_${index + 1}_id`, hour.end_time);
            user.set(`test_book_provider_${index + 1}_id`, hour.provider_id);
            user.set(`test_book_provider_name_${index + 1}_id`, hour.provider_name);
        });
      OUTPUTS.log(`opciones de horario: ${options}`); // Success log
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