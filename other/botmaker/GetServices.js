//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_service_selected';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const location_id = "84887";
const categorySelected = user.get('test_service_category_selected');
const category = user.get(`test_service_category_${categorySelected}_id`);

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: URI+"services/?location_id="+location_id+"&category="+category,
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
  	const services = response.services;
  	if(services.length > 0) {
          let options = "";
          services.forEach((service, index) => {
              options += `\n ${index + 1}. Nombre: ${service.name} \n Duración: ${service.duration}mins\n`;
              user.set(`test_service_name_${index + 1}_id`, service.name);
              user.set(`test_service_${index + 1}_id`, service.id);
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