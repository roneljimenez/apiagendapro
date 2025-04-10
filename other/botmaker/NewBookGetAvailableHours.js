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
const location_id = "84887";
const service_id = JSON.parse(user.get("test_service_selected")).idService;
const date = JSON.parse(user.get("test_slot_selected")).date;

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
  	const moreHoursOption = { id: 99, name: "Ver más horas" };
    const goBackOption = { id: 100, name: "Volver al inicio" };
  	let myJSONList = available_hours.map((hour, index) => {
      return {id:index, name:hour.start_block, startDate: hour.start_time, endDate: hour.end_time, providerId: hour.provider_id, providerName: hour.provider_name};
    });
  
  	if(available_hours.length > 0) {
      
      let options = "";
      
      if(myJSONList.length >= 9 ){
        
          let firstGroup = [];
  		  let nextHours = [];
          firstGroup = myJSONList.slice(0, 9);
		  nextHours = myJSONList.slice(10);
          firstGroup = [...firstGroup, moreHoursOption];
          nextHours = [...nextHours, goBackOption];
          user.set('test_available_hours', JSON.stringify(firstGroup));
          user.set('test_next_available_hours', JSON.stringify(nextHours));
        
      	  firstGroup.forEach((hour, index) => {
        	options += `\n ${index + 1}. Hora: ${hour.name}, \n Profesional: ${hour.providerName} \n`;
          });

      }else{
        
      	  	myJSONList = [...myJSONList, goBackOption];
    		user.set('test_available_hours', JSON.stringify(myJSONList));
        	myJSONList.forEach((hour, index) => {
        		options += `\n ${index + 1}. Hora: ${hour.name}, \n Profesional: ${hour.providerName} \n`;
            });
      }
	  
       OUTPUTS.log(`opciones de horario: ${options}`); // Success log
      
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