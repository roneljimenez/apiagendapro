const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const main = async () => {
      let hourSelected = JSON.parse(user.get('test_hour_selected')).name;
  	  user.set('test_hour_name_selected', hourSelected);
    };
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);

