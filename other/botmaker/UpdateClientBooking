const querystring = require("querystring");
//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'PATCH';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_update_status';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const bookingSelected = user.get('test_book_selected');
const bookingId = user.get(`test_book_${bookingSelected}_id`);
const hourSelected = user.get('test_hour_selected');
const startDate = user.get(`test_book_start_hour_${hourSelected}_id`);
const endDate = user.get(`test_book_end_hour_${hourSelected}_id`);
const status_id = 1;
const formData = querystring.stringify({
  start: startDate,
  end: endDate,
  status_id: status_id
});


const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/client/bookings/${bookingId}`,
        json: true,
        headers: {
          	"Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "Authorization": AUTHENTICATION,
        },
      	body: formData
    });
};

const main = async() => {
    const response = await callServiceApiRest();
  	if(!response.detail){
    	user.set(BM_RESULT_VAR_NAME, "Error");
      OUTPUTS.log(`Oops! Ha ocurrido un error. Por favor vuelve a intentarlo en unos minutos.`); // error log
    }else{
      OUTPUTS.log(`Tu agenda ha sido actualizada, recibirás el detalle en tu correo electrónico.`); // Success log
      user.set(BM_RESULT_VAR_NAME, JSON.stringify(response.response));
    }
    
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  Error - ${CUSTOMER_ID} - ${err.message}`;
        user.set('ca_error', errorMessage);
        OUTPUTS.log(`Oops! Ha ocurrido un error. Por favor vuelve a intentarlo en unos minutos.`); // error log
    })
    .finally(result.done);