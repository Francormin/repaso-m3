const express = require('express');
const characters = require("./routes/characters");
const species = require("./routes/species");

const server = express();

// Acuérdense de agregar su router o cualquier middleware que necesiten acá.

server.use(express.json());

server.use("/characters", characters);
server.use("/species", species);

server.listen(3000, () => {
    console.log('running on port', 3000);
});