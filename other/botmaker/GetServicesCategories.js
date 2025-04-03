//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_service_category_selected';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const location_id = "84887";

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: URI+"services/categories/?location_id="+location_id,
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
  	const categories = response.categories ? response.categories : "" ;
    if(categories.length > 0) {
    	let options = "";
      	categories.forEach((category, index) => {
        	options += `\n ${index + 1}. ${category} \n`;
            user.set(`test_service_category_${index + 1}_id`, category);
        });
      OUTPUTS.log(`Servicios: ${options}`); // Success log
      user.set(BM_RESULT_VAR_NAME, options);
    }else{
      user.set(BM_RESULT_VAR_NAME, "No hay servicios disponibles.");
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