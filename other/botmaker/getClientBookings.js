//@constant('Use external service URI')
const URI = 'https://www.autoagenda.bitscyt.com/api/';

//@constant('Use http method (POST, GET, PUT...)')
const METHOD = 'GET';

//@constant('Authentication key. Only if the service requires')
const AUTHENTICATION = '';

//@constant('Variable where the response will be stored')
const BM_RESULT_VAR_NAME = 'test_client_bookings';

const IS_TEST = user.get('botmakerEnvironment') === 'DEVELOPMENT';
const CUSTOMER_ID = context.userData._id_;

const OUTPUTS = {
    log: (text) => { IS_TEST ? result.text(text) : bmconsole.log(text); },
};

const clientEmail = user.get('test_client_email');

const callServiceApiRest = () => {
    return rp({
        method: METHOD,
        uri: URI+"client/bookings?search="+clientEmail,
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
  	const bookings = response.bookings || [];
    if (bookings.length > 0) {
      let options = "";
      let date, year, month, day, hours, minutes;
      bookings.forEach((book, index) => {
        date = new Date(book.start);
        year = date.getFullYear();
        month = date.getMonth()+1;
        day = date.getDate();
        hours = date.getUTCHours();  // Hora en UTC
		minutes = date.getUTCMinutes(); // Minutos en UTC
        options += `\n ${index + 1}. Servicio: ${book.service},\n Lugar: ${book.location} \nFecha:${day}-${month}-${year} \n Hora: ${hours}:${minutes}\n`;
        user.set(`test_book_${index + 1}_id`, book.id);
        user.set(`test_book_service_${index + 1}_id`, book.service_id);
        user.set(`test_book_location_${index + 1}_id`, book.location_id);
      });
      user.set(BM_RESULT_VAR_NAME, options);
      OUTPUTS.log(`Reservas agendadas: ${options}`);
      user.set('test_has_bookings', true);
    } else {
      user.set(BM_RESULT_VAR_NAME, "No tienes horas agendadas.");
      user.set('test_has_bookings', false);
    }
    //OUTPUTS.log(`Integration with api rest - ${CUSTOMER_ID} - ${JSON.stringify(response, null, 2)}`); // Success log

};

main()
    .catch((err) => {
        // Code on error
        const errorMessage = `[Integration with api rest] :  Error - ${CUSTOMER_ID} - ${err.message}`;
        user.set('ca_error', errorMessage);
   		user.set('test_has_bookings', false);
        //OUTPUTS.log(errorMessage);
    })
    .finally(result.done);