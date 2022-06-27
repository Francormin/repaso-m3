const { default: axios } = require('axios');
const express = require('express');

const router = express.Router();
module.exports = router;

// al no haber base de datos las especies creadas se deberan guardar en este arreglo
let speciesCreated = [];

async function getSpecies() {
    let characters = await axios.get("https://rickandmortyapi.com/api/character");
    let species = await characters.data.results.map(character => character.species);
    return species;
}

router.get("/", async (req, res) => {
    let speciesArray = await getSpecies();
    let species = [...speciesArray, ...speciesCreated];
    let uniqueSpecies = [...new Set(species)];
    res.status(200).json(uniqueSpecies);
});

router.post("/", (req, res) => {
    let { species } = req.body;
    if (species.includes(",")) {
        species = species.split(", ");
    }
    typeof species === "string" ? speciesCreated.push(species) : speciesCreated = [...speciesCreated, ...species];
    res.status(200).send("Species created successfully!");
});