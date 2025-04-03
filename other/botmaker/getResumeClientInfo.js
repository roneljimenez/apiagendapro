const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const main = async () => {
    const clientInfo = {
    	firstName : user.get('test_book_client_name'),
      	lasttName : user.get('test_book_client_last_name'),
      	phone : user.get('test_book_client_phone'),
      	rut : user.get('test_book_client_rut')
    };
  	OUTPUTS.log(`Sus datos guardados son:
    	Nombre: ${clientInfo.firstName},
        Apellido: ${clientInfo.lasttName},
        Teléfono: ${clientInfo.phone},
        Correo: ${clientInfo.rut}
    `);
};
    
main()
    .catch(err => {
        // Code on error
        const errorMessage = `[CA_NAME] Error ${err.message}`;
        user.set('ca_error', errorMessage); // Set error variable with error message to see on Events
        bmconsole.log(errorMessage); // Log Error
    })
    .finally(result.done);
