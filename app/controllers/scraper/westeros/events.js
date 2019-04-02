const MWBot = require('mwbot');
const cheerio = require('cheerio');

const AgesScraper = require("./ages");
const agesScraper = new AgesScraper();

class EventScraper {
    constructor()
    {
        this.bot = new MWBot({
            apiUrl: 'https://awoiaf.westeros.org/api.php'
        });
    }

    async getAll()
    {
        let events = [];
        let ages = await agesScraper.getAllWithEvents();

        for (let i = 0; i < ages.length; i++) {
            for (let j = 0; j < ages[i].events.length; j++) {
                let event = ages[i].events[j];
                event.age = ages[i].name;
                events.push(event);
            }
        }

        return events;
    }
}

module.exports = EventScraper;