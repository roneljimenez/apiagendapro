const querystring = require("querystring");
//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'POST';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_booking_created';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const hourSelected = user.get('test_hour_selected');
const serviceSelected = user.get("test_service_selected");

const bookingInfo = {
	startDate: user.get(`test_book_start_hour_${hourSelected}_id`),
  	endDate: user.get(`test_book_end_hour_${hourSelected}_id`),
  	serviceId: user.get(`test_service_${serviceSelected}_id`),
  	providerId: user.get(`test_book_provider_${hourSelected}_id`),
};

const clientInfo = {
  name : user.get("test_book_client_name"),
  lastName : user.get("test_book_client_last_name"),
  email : user.get("test_client_email"),
  phone : user.get("test_book_client_phone"),
  rut : user.get("test_book_client_rut")
};

const formData = querystring.stringify({
      start: bookingInfo.startDate,
      end: bookingInfo.endDate,
      service_id: bookingInfo.serviceId,
      provider_id: bookingInfo.providerId,
      first_name: clientInfo.name,
      last_name: clientInfo.lastName,
      email: clientInfo.email,
      phone: clientInfo.phone,
      identification_number: clientInfo.rut
});

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/client/bookings/`,
        json: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Accept': 'application/json',
            "Authorization": AUTHENTICATION,
        },
      body: formData
    });
};

const main = async() => {
    const response = await callServiceApiRest();
    if(!response.detail){
    	user.set(BM_RESULT_VAR_NAME, "Error");
    }else{
      OUTPUTS.log(`Resultado: ${response.detail}`); // Success log
      user.set(BM_RESULT_VAR_NAME, JSON.stringify(response.response));
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