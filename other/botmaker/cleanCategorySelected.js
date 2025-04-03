const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const main = async () => {
      let categorySelected = user.get('test_service_category_selected');
      categorySelected = JSON.parse(categorySelected);
  	  user.set('test_service_category_selected', categorySelected.name);
  	  OUTPUTS.log(categorySelected.name);
    };
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);
