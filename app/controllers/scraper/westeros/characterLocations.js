const MWBot = require('mwbot');
const cheerio = require('cheerio');

const CharactersScraper = require("./characters");
const charactersScraper = new CharactersScraper();
const City = require( "../../../models/westeros/city");

class CharacterLocationScraper {
    constructor()
    {
        this.bot = new MWBot({
            apiUrl: 'https://awoiaf.westeros.org/api.php'
        });
    }

    async getAllCities()
    {
        return new Promise(function (resolve) {
            City.find(function(err,cities) {
                if(err) {
                    throw err;
                }

                resolve(cities);
            });
        });
    }

    async getAll()
    {
        console.log("fetching cities from db");

        let cities = await this.getAllCities();
        let cityNames = [];

        for(let i = 0; i < cities.length; i++)
        {
            if(cities[i].name !== undefined && cities[i].name.length > 0) {
                cityNames.push(cities[i].name);
            }
        }

        console.log("fetching all character names from wiki");
        let characters = await charactersScraper.getAllNames();

        let result = [];

        console.log("started fetching all character locations");
        for(let i = 0; i < characters.length; i++)
        {
            let characterLocations = await this.get(characters[i], cityNames);

            if(characterLocations)
            {
                result.push(characterLocations);
            }
        }

        return result;
    }
    
    async get(characterName, locationNames)
    {
        if(!characterName){
            console.log("Skipped: " + characterName);

            return null;
        }

        console.log("Fetching " + characterName);

        let pageName = characterName.replace(/\s/g, "_");
        let data;

        try {
            data = await this.bot.request({
                action: "parse",
                page: pageName,
                format: "json",
                redirects: ""
            });
        }
        catch (e) {
            console.log(e);

            return null;
        }

        let character = {};
        let body = data.parse.text["*"];
        let locationHits = [];

        for(let i = 0; i < locationNames.length; i++)
        {
            if(body.indexOf(locationNames[i]) > -1) {
                locationHits.push(locationNames[i]);
            }
        }

        character.name = characterName;
        character.slug = pageName;
        character.locations = locationHits;

        console.log("Fetched " + character.name);
        console.log("Locations " + character.locations);

        return character;
    }
}

module.exports = CharacterLocationScraper;