//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_available_categories';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;
const location_id = "84887";

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: `${URI}/services/categories/?location_id=${location_id}`,
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
  	const moreServicesOption = { id: 99, name: "Ver más servicios" };
    const goBackOption = { id: 100, name: "Volver al inicio" };
  	let myJSONList = categories.map((category, index) => {return {id:index, name:category};});
  
  if(categories.length >= 9 ){
  	let firstGroup = [];
  	let nextCategories = [];
  	
	firstGroup = myJSONList.slice(0, 9);
    nextCategories = myJSONList.slice(10);
  	firstGroup = [...firstGroup, moreServicesOption];
  	nextCategories = [...nextCategories, goBackOption];
  	user.set('test_available_categories', JSON.stringify(firstGroup));
    user.set('test_next_available_categories', JSON.stringify(nextCategories));
  }else{
  	myJSONList = [...myJSONList, goBackOption];
    user.set('test_available_categories', JSON.stringify(myJSONList));
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