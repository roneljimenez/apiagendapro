const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const main = async () => {
      let serviceSelected = JSON.parse(user.get('test_service_selected')).name;
  	  user.set('test_service_name_selected', serviceSelected);
    };
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);
