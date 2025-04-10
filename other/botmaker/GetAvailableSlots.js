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
const service_id = JSON.parse(user.get(`test_book_selected`)).idService;
const location_id = JSON.parse(user.get(`test_book_selected`)).idLocation;

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
  	const available_slots = response.slots ? response.slots : "";
    let myJSONList = available_slots.map((slot, index) => {
      const fecha = new Date(slot.date);
      const fechaFormateada = new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(fecha);
      return {id:index, name:fechaFormateada, date: slot.date};
    });

  	if(available_slots.length > 0) {
      //me falta agregar la opción de volver atrás
      user.set('test_available_slots', JSON.stringify(myJSONList));
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