require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use("/api", routes);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Conectado a MongoDB"))
//   .catch((err) => console.error("Error en MongoDB", err));

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
