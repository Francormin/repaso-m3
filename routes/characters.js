const { default: axios } = require('axios');
const express = require('express');

const router = express.Router();
module.exports = router;

// al no haber base de datos los personajes creados se deberan guardar en este arreglo
let charactersCreated = [];
let id = 21;

async function getCharacters() {
    let getChar = await axios.get("https://rickandmortyapi.com/api/character");
    let charactersApi = await getChar.data.results;
    let characters = await charactersApi.map(character => {
        return {
            id: character.id,
            name: character.name,
            species: character.species,
            gender: character.gender,
            image: character.image
        };
    });
    return [...characters, ...charactersCreated];
}

router.get("/", async (req, res) => {
    let { name, gender, species } = req.query;
    let characters = await getCharacters();
    if (name) {
        let nameFilter = characters.filter(character => character.name.toLowerCase().includes(name.toLowerCase()));
        nameFilter.length ? res.status(200).json(nameFilter) : res.status(404).send("There is no character with that name");
    } else if (gender) {
        let genderFilter = characters.filter(character => character.gender.toLowerCase().includes(gender.toLowerCase()));
        genderFilter.length ? res.status(200).json(genderFilter) : res.status(404).send("There is no character with that gender");
    } else if (species) {
        let speciesFilter = characters.filter(character => character.species.toLowerCase().includes(species.toLowerCase()));
        speciesFilter.length ? res.status(200).json(speciesFilter) : res.status(404).send("There is no character with that species");
    } else {
        res.status(200).json(characters);
    }
});

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let characters = await getCharacters();
    let character = characters.filter(character => character.id === parseInt(id));
    character.length ? res.status(200).json(character[0]) : res.status(404).send("There is no character with that id");
});

router.post("/", async (req, res) => {
    let { name, species, gender, image } = req.body;
    let speciesArray = (await axios.get("http://localhost:3000/species")).data;
    let newCharacter = { id, name, species, gender, image };
    if (!newCharacter.name || !newCharacter.species || !newCharacter.gender || !newCharacter.image) {
        res.status(400).send("The new character must have a name, a species, a gender and an image");
    } else if (!speciesArray.includes(newCharacter.species)) {
        res.status(400).send("The species is not valid");
    } else {
        charactersCreated.push(newCharacter);
        id++;
        res.status(200).send("Character created successfully!");
    }
});