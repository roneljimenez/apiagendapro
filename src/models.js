const mongoose = require("mongoose");

//Modelo: Cliente
const ClientSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: String,
  email: { type: String, required: true },
  identification_number: String,
  phone: String,
  id_agendapro_client: { type: String, required: true },
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;