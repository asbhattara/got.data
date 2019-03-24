const MWBot = require('mwbot');
const cheerio = require('cheerio');


class CharacterScraper {
    constructor() {
        this.bot = new MWBot({
            apiUrl: 'https://gameofthrones.fandom.com/api.php'
        });
    }

    async getAllNames() {
        let data = await this.bot.request({
            action: "parse",
            format: "json",
            page: "Game_of_Thrones_(TV_series)"
        });

        const $ = cheerio.load(data["parse"]["text"]["*"]);

        let names = [];

        $("#Cast").parent().nextUntil("h2").each(function () {
            let $this = $(this);

            if($this[0]["name"] !== "ul")
            {
                return true;
            }

            $this.find("li").each(function () {
                let parts = $(this).html().split(" as ");
                let info = {"character": {"name": null, "wiki": null}, "actor": {"name": null, "wiki": null}};

                if(parts.length < 2)
                {
                    return true;
                }

                let $actor = $("<div>" + parts[0] + "</div>").find("a");
                let $character = $("<div>" + parts[1] + "</div>").find("a");

                info["actor"]["name"] = $($actor[0]).text();
                info["actor"]["slug"] = decodeURIComponent($($actor[0]).attr("href").replace("/wiki/", ""));

                info["character"]["name"] = $($character[0]).text();
                info["character"]["slug"] = decodeURIComponent($($character[0]).attr("href").replace("/wiki/", ""));

                names.push(info);
            });

        });

        return names;
    }

    async scrapeAll() {
        let names = await this.getAllNames();
        let data = [];

        for(let i = 0; i < names.length; i++)
        // for(let i = 0; i < 4; i++)
        {
            let character = names[i]["character"];

            console.log("scraping", character["name"], "(", (i + 1), "/", names.length, ")");

            data.push(await this.scrape(character["name"], character["slug"]));
        }
        return data;
    }

    async scrape(name, page) {
        let data = await this.bot.request({
            action: "parse",
            format: "json",
            page: page
        });
        const $ = cheerio.load(data["parse"]["text"]["*"]);


        let result = {
            "name": name,
            "slug": page,
            "nicknames": [],
            "titles": [],
            "gender": null,
            "image": null,

            "alive": true,
            "birth": null,
            "death": null,

            "origin": null,
            "mother": null,
            "father": null,
            "siblings": [],

            "spouse": null,
            "lovers": [],

            "cultures": [],
            "religions": [],
            "allegiances": [],

            "first_seen": null,
            "seasons": [],
            "appearances": [],
            "actor": null,
        };

        console.log("Scrape for" + name);

        // scrape character image
        result["image"] = $(".pi-image-thumbnail").attr("src");

        var infobox = $(".portable-infobox");

        // scrape personal description (right info box)
        infobox.find(".pi-item").each(function() {
            let rows, i, tmp;

            var lastDeathEpisode;

            let $this = $(this);
            let $data = $this.find(".pi-data-value");

            switch ($this.data("source")) {
                case "Season":
                    rows = $data.text().replace(" ", "").split(",");

                    for(i = 0; i < rows.length; i++)
                    {
                        if(!rows[i])
                        {
                            continue;
                        }

                        result["seasons"].push(parseInt(rows[i]));
                    }

                    break;
                case "First":
                    result["first_seen"] = $data.find("a").text();

                    break;
                case "DeathEp":
                case "Titles":
                    rows = $data.html().split("<br>");

                    for(i = 0; i < rows.length; i++)
                    {
                        result["titles"].push($("<div>" + rows[i] + "</div>").text().replace(/\(.*\)/, "").trim())
                    }

                    break;
                case "Aka":
                    rows = $data.html().split("<br>");

                    for(i = 0; i < rows.length; i++)
                    {
                        tmp = $("<div>" + rows[i] + "</div>").text().replace(/\(.*\)/, "").replace(/\[.*]/, "").trim();

                        if(!tmp)
                        {
                            continue;
                        }

                        result["nicknames"].push(tmp)
                    }

                    break;
                case "Death":
                    result["death"] = parseInt($data.text().replace(/[^0-9.]/g, ""));

                    break;
                case "Birth":
                    result["birth"] = parseInt($data.text().replace(/[^0-9.]/g, ""));

                    break;
                case "Status":
                    result["alive"] = $data.find("a").text().toLowerCase() !== "deceased";

                    break;
                case "Culture":
                    $data.find("a").each(function () {
                        result["cultures"].push($(this).text())
                    });

                    break;
                case "Religion":
                    $data.find("a").each(function () {
                        result["religions"].push($(this).text())
                    });

                    break;
                case "Father":
                    result["father"] = $($data.find("a")[0]).text();

                    break;
                case "Mother":
                    result["mother"] = $($data.find("a")[0]).text();

                    break;
                case "Siblings":
                    $data.find("a").each(function () {
                        result["siblings"].push($(this).text())
                    });

                    break;
                case "Spouse":
                    result["spouse"] = $($data.find("a")[0]).text();

                    break;
                case "Lovers":
                    $data.find("a").each(function () {
                        result["lovers"].push($(this).text())
                    });

                    break;
                case "Place":
                    result["origin"] = $($data.find("a")[0]).text();

                    break;
                case "Allegiance":
                    $data.find("a").each(function () {
                        result["allegiances"].push($(this).text())
                    });

                    break;
                case "Actor":
                    result["actor"] = $($data.find("a")[0]).text();

                    break;
                // Fields to ignore
                case "Title":
                case "Image":
                case "Appearances":
                case "Predecessor":
                case "Successor":
                case "Children":
                case "Last":
                case "Age":
                case "Mentioned":
                    break;
                default:
                    //console.log($this.data("source"), ":", $data.html());
            }
        });

        // scrape gender
        let male_counter = (data["parse"]["text"]["*"].match(/\shis\s|\shim\s|He|himself/g) || []).length;
        let female_counter = (data["parse"]["text"]["*"].match(/\sher\s|She|herself/g) || []).length;

        if(male_counter > female_counter) {
            result["gender"] = "male";
        }
        else
        {
            result["gender"] = "female";
        }
        var sliceEp = false;
        var lastEp = $('div[data-source=DeathEp]').find(".pi-data-value").text().replace(/\"/g, "").trim()
        console.log(lastEp);
        // scrape appearances in episodes
        $(".appearances").each(function () {
            let $table = $(this);

            // skip if table is not for tv show
            if($table.text().search("Season") === -1)
            {
                return true;
            }

            if(sliceEp) {
                sliceEp = false;
                return false;
            }

            $table.find("td").each(function () {
                let $td = $(this);

                // skip if it is the header
                if($td.attr("colspan"))
                {
                    return true;
                }
                var episode = $td.text().trim()

                console.log(episode);

                


                result["appearances"].push(episode);

                if(episode == lastEp) {
                    sliceEp = true;
                    return false;
                }
            });
        });



        return result;
    }
}

// sample characters output: https://pastebin.com/AByMyz0W

module.exports = CharacterScraper;