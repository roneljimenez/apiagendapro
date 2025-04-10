const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const main = async() => {
    // TODO your code here
  const step = context.params.step;
  const nextOptions = JSON.parse(user.get(`test_next_available_${step}`));
  if(nextOptions.length < 9){
	user.set(`test_available_${step}`, JSON.stringify(nextOptions));  
  }else{
    let message = "";
    switch (step){
      case "hours":
        message = "horas";
        break;
      case "services":
        message = "servicios";
        break;
      case "categories":
        message = "servicios";
        break;
      }
      const moreOptions = { id: 99, name: `Ver más ${message}` };
      const goBackOption = { id: 100, name: "Volver al inicio" };
      let firstGroup = [];
  	  let nextnextOptions = [];
    	firstGroup = nextOptions.slice(0, 9);
		nextnextOptions = nextOptions.slice(10);
        firstGroup = [...firstGroup, moreOptions];
        nextnextOptions = [...nextnextOptions, goBackOption];
        user.set(`test_available_${step}`, JSON.stringify(firstGroup));
        user.set(`test_next_available_${step}`, JSON.stringify(nextnextOptions));
  }
  

};

main()
    .catch(err => {
        // Code on error
        const errorMessage = `[User Basic Template] Error - ${context.userData._id_} - ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);