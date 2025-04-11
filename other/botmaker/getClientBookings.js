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
  log: (text) => {
    IS_TEST ? result.text(text) : bmconsole.log(text);
  },
};

const clientEmail = user.get('test_client_email');

const callServiceApiRest = () => {
  return rp({
    method: METHOD,
    uri: URI + 'client/bookings?search=' + clientEmail,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: AUTHENTICATION,
    },
  });
};

const main = async () => {
  const response = await callServiceApiRest();
  const bookings = response.bookings || [];
  if (bookings.length > 0) {
    const moreBookingsOption = { id: 99, name: 'Ver más reservas' };
    const goBackOption = { id: 100, name: 'Volver al inicio' };
    let myJSONList = bookings.map((book, index) => {
      const date = new Date(book.start);
     const  year = date.getFullYear();
     const  month = date.getMonth() + 1;
     const  day = date.getDate();
     const  slotDate = `${year}-${month}-${day}`;
     const  fechaFormateada = new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
      return {
        id: index,
        name: index+1,
        idBook: book.id,
        idService: book.service_id,
        idLocation: book.location_id,
        slotDate: slotDate,
        fechaFormateada: fechaFormateada
      };
    });
    let options = '';
    let date, year, month, day, hours, minutes;
    bookings.forEach((book, index) => {
      date = new Date(book.start);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
      hours = date.getUTCHours(); // Hora en UTC
      minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Minutos en UTC
      options += `\n ${index + 1}. Servicio: ${book.service},\n Lugar: ${
        book.location
      } \nFecha:${day}-${month}-${year} \n Hora: ${hours}:${minutes}\n`;
    });
    if (myJSONList.length >= 9) {
      let firstGroup = [];
      let nextHours = [];
      firstGroup = myJSONList.slice(0, 9);
      nextHours = myJSONList.slice(10);
      firstGroup = [...firstGroup, moreBookingsOption];
      nextHours = [...nextHours, goBackOption];
      user.set('test_available_bookings', JSON.stringify(firstGroup));
      user.set('test_next_available_bookings', JSON.stringify(nextHours));
    } else {
      myJSONList = [...myJSONList, goBackOption];
      user.set('test_available_bookings', JSON.stringify(myJSONList));
    }
          OUTPUTS.log(`Reservas agendadas: ${options}`);
      user.set('test_has_bookings', true);
  } else {
    user.set(BM_RESULT_VAR_NAME, 'No tienes horas agendadas.');
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
