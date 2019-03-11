const MWBot = require('mwbot');
const cheerio = require('cheerio');

class EpisodeScraper {
    constructor() {
        this.bot = new MWBot({
            apiUrl: 'https://gameofthrones.fandom.com/api.php'
        });
    }

    async getAllEpisodesRaw() {
        let data = await this.bot.request({
            action: "parse",
            format: "json",
            page: "Category:Episodes"
        });

        const $ = cheerio.load(data["parse"]["text"]["*"]);

        let names = [];

        let episode = {"number": null, "title": null, "reference": null, "image": null, "date": null, "viewers": null, "preview_text": null};

        $("table").each(function() {
            let $table = $(this);

            $table.find("tr:not(:first-child)").each(function (i) {
                let $this = $(this);

                if (i % 2 === 0) {
                    episode = {"number": null, "title": null, "reference": null, "image": null, "date": null, "viewers": null, "preview_text": null};
                    $this.find("td").each(function(j) {
                        let $e = $(this);
                        switch (j % 5) {
                            case 0:
                                episode.number = parseInt($e.text().replace('\n', '').trim());
                                break;

                            case 1:
                                episode.image = $e.find("img").attr('data-src');
                                break;

                            case 2:
                                episode.reference = $e.find("a").attr('href');
                                episode.title = $e.find("a").text();
                                break;

                            case 3:
                                episode.date = $e.text().replace('\n', '').trim();
                                break;

                            case 4:
                                episode.viewers = parseFloat($e.text().replace('\n', '').trim());
                                break;
                        }
                    });
                } else {
                    episode.preview_text = $this.find("td").first().text().substr(1).replace('\n', '');
                    names.push(episode);
                }
            });
        });

        return names;
    }

    async scrape(episode, previous) {
        let data = null;
        try {
            data = await this.bot.request({
                action: "parse",
                format: "json",
                page: decodeURIComponent(episode.reference.substr(6))
            });
        } catch (err) {
            return false;
        }
        const $ = cheerio.load(data["parse"]["text"]["*"]);

        let ret = {
            "title": null,
            "number": null,
            "season": null,
            "episode": null,
            "image": null,
            "date": null,
            "viewers": null,

            "runtime": null,
            "written_by": null,
            "directed_by": null,
            "preview_text": null,

            "characters": [],
            "deaths": [],
            "places": [],

            "predecessor": null,
            "successor": null
        };

        ret = episode;
        ret.characters = [];
        ret.deaths = [];
        ret.places = [];
        ret.written_by = [];

        ret.prev = null;
        ret.next = null;

        let $infobox = $(".portable-infobox");

        // parsing season and episode
        $infobox.find("td").each(function(i) {
            let $td = $(this);
            if (i === 0)
                ret.season = parseInt($td.text().trim().substr(7));
            if (i === 1)
                ret.episode = parseInt($td.text().trim().substr(8));

        });

        // parsing rest of infobox
        $infobox.find(".pi-item").each(function() {
            let $item = $(this);
            let $val = $item.find(".pi-data-value").text();
            switch ($item.find(".pi-data-label").first().text()) {
                case "Runtime":
                    ret.runtime = parseInt($val.replace('minutes', '').trim());
                    break;

                case "Directed by":
                    ret.directed_by = $val;
                    break;

                case "Written by":
                    let $$val = $val.split(' & ');
                    for (let f = 0; f < $$val.length; f++) {
                        ret.written_by.push($$val[f]);
                    }
                    break;

                case "Air date": // ignore
                default:
                    break;
            }
        });

        // parsing prev and next
        if (previous != null) {
            ret.prev = previous.number;
            previous.next = ret.number;
        }

        // parsing the characters
        $("#First, #Characters").parent().next().find("li").each(function() {
            let $li = $(this);
            let $a = $li.find("a").first();
            if ($a.text().trim().length > 0)
                ret.characters.push($a.text().trim().replace('\n', ''));
        });

        // parsing deaths
        $("#Deaths").parent().next().find("li").each(function() {
            let $li = $(this);
            let $a = $li.find("a").first();
            if ($a.text().trim().length > 0)
                ret.deaths.push($a.text().trim().replace('\n', ''));
        });

        // parsing places
        $("#Summary, #Synopsis, #Plot").parent().nextUntil("h2").each(function() {
            let $this = $(this);
            if ($this[0]["name"] !== "h3")
                return true;

            ret.places.push($this.text().substr(0, $this.text().length - 4).trim());
        });

        return ret;
    }

    async scrapeAll() {
        let episodes = await this.getAllEpisodesRaw();
        let data = [];

        let previous = null;
        for(let i = 0; i < episodes.length; i++) {
            console.log("started scraping ", episodes[i].title);
            let e = await this.scrape(episodes[i], previous);

            previous = e;
            if (e)
                data.push(e);
            else
                console.log("invalid page");
        }

        return data;
    }
}

// sample episode result: https://pastebin.com/sqCH3ybF

module.exports = EpisodeScraper;