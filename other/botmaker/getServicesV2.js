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


const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: URI+"services/?location_id="+location_id+"&category="+categorySelected,
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
  	const services = response.services ? response.services : "";
    const moreServicesOption = { id: 99, name: "Ver más servicios" };
    const goBackOption = { id: 100, name: "Volver al inicio" };
    let myJSONList = services.map((service, index) => {return {id:index, name:service.name, idService: service.id};});
  
  	if(services.length >= 9) {
      
      	  let firstGroup = [];
  		  let nextServices = [];
          firstGroup = myJSONList.slice(0, 9);
		  nextServices = myJSONList.slice(10);
          firstGroup = [...firstGroup, moreServicesOption];
          nextServices = [...nextServices, goBackOption];
          user.set('test_available_services', JSON.stringify(firstGroup));
          user.set('test_next_available_services', JSON.stringify(nextServices));
      
    }else{
        myJSONList = [...myJSONList, goBackOption];
        user.set('test_available_services', JSON.stringify(myJSONList));
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