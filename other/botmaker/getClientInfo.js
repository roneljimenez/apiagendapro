//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = '';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const userEmail = user.get('test_client_email');

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/client/?search=${userEmail}`,
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
    	user.set('test_is_client', true);
        user.set('test_book_client_name', response.data.firstName);
      	user.set('test_book_client_last_name', response.data.lastName);
      	user.set('test_book_client_phone', response.data.phone);
      	user.set('test_book_client_rut', response.data.rut);
      OUTPUTS.log('Si es cliente y guardamos sus datos');

};

main()
    .catch((err) => {
        // Code on error
      if(err.statusCode == 404){
          OUTPUTS.log(err.error.error);
      }else{
          const errorMessage = `[Integration with api rest] :  Error - ${CUSTOMER_ID} - ${err.message}`;
          user.set('ca_error', errorMessage);
          OUTPUTS.log(errorMessage);
      }
    })
    .finally(result.done);