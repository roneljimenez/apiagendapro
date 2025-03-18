//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'DELETE';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_booking_action_response';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const bookingSelected = user.get('test_book_selected');
const bookIdString = `test_book_${bookingSelected}_id`;
const bookId = user.get(bookIdString);


const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: URI+"client/bookings/"+bookId,
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
  	if(response.response){
      OUTPUTS.log(`Su reserva ha sido eliminada exitosamente.`); // Success log
      user.set(BM_RESULT_VAR_NAME, JSON.stringify(response));
    }else{
    	OUTPUTS.log(`Ooops! Ha ocurrido un error. Por favor vuelve a intentarlo en unos minutos.`); // error log
    }
    
};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  Error - ${CUSTOMER_ID} - ${err.message}`;
        user.set('ca_error', errorMessage);
        OUTPUTS.log(`Ooops! Ha ocurrido un error. Por favor vuelve a intentarlo en unos minutos.`); // error log
    })
    .finally(result.done);