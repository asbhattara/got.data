(function () {
    "use strict";
    var bot = require("nodemw");
    var client = new bot({
        server: "awoiaf.westeros.org",
        path: "/api.php",
        concurrency: "5"
    });
    var jsonfile = require('jsonfile');
    var HtmlParser = require('cheerio');
    var async = require('async');

    module.exports = {
        /*
         * Fetches details for one character
         */
        get: function (characterName, callback) {
            if(!characterName){
                console.log("Skipped: "+characterName);
                return ;
            }

            var pageName = characterName.replace(/\s/g, "_");

            var params = {
                action: "parse",
                page: pageName,
                format: "json",
				redirects: ""
            };

            var character = {};
            client.api.call(params, function (err, info, next, data) {
                if (data) {
                    character.name = characterName;
                    character.slug = pageName.replace(/'/g,'_');



                    // Fetch Gender
                    if (data.parse.properties.length !== 0) {
                        var firstAttempt = data.parse.properties[0]["*"];
                        var gender = null;
                        if (firstAttempt !== null) {
                            var phrases = firstAttempt.split(".");
                            if (phrases.length > 1) {
                                var phrase = phrases[1].trim();
                                if (phrase.indexOf("He") === 0 || phrase.indexOf("His") === 0) {
                                    gender = "Male";
                                }
                                else if (phrase.indexOf("She") === 0 || phrase.indexOf("Her") === 0) {
                                    gender = "Female";
                                }
                            }
                        }

                        if (gender === null) {
                            var secondAttempt = data.parse.text["*"];
                            if (secondAttempt !== null) {
                                var fGender = (secondAttempt.match(/\sher\s|She|herself/g) || []).length;
                                var mGender = (secondAttempt.match(/\shis\s|\shim\s|He|himself/g) || []).length;
                                if (fGender > mGender) {
                                    gender = "Female";
                                }
                                else if (fGender < mGender) {
                                    gender = "Male";
                                }
                                else {
                                    gender = null;
                                }
                            }
                        }

                        if (gender == "Male") {
                            character.male = true;
                        }
                        else {
                            character.male = false;
                        }
                    }

                    //fetch the image
                    var $ = HtmlParser.load(data.parse.text["*"]);
                    var imgLink = $('.infobox-image img').attr('src');
                    if(imgLink !== undefined) {
                        character.imageLink = imgLink;
                    }



                    var infobox = $('.infobox th');

                    //fetch titles
                    character.titles = [];

                    var titleTd = infobox.
                        filter(function(i, el) {return $(this).html() === 'Title';}).
                        parent().find('td')
                    ;

                    if(titleTd.html() !== null)
                    {
                        // get multiple titles
                        var titles = titleTd.html().split('<br>');
                        titles.forEach(function(title) {
                            // remove html tags and unnecessary spaces
                            title = title.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

                            // remove references like [1]
                            title = title.replace(/\[\d+\]+/g, '');

                            title = title.replace(/&apos;/g,"'");
                            title = title.replace(/&amp;/g,"&");

                            character.titles.push(title);
                        });
                    }


                    //fetch books
                    character.books = [];
                    var booksTd = infobox.
                        filter(function(i, el) {return $(this).html() === 'Book(s)';}).
                        parent().find('td')
                    ;

                    if(booksTd.html() !== null)
                    {
                        // get multiple titles
                        var books = booksTd.html().split('<br>');
                        books.forEach(function(book) {
                            // remove html tags and unnecessary spaces
                            book = book.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

                            // remove references like [1]
                            book = book.replace(/\(\w+\)+/g, '').trim();

                            book = book.replace(/&apos;/g,"'");
                            book = book.replace(/&amp;/g,"&");

                            character.books.push(book);
                        });
                    }

                    // fetch actor
                    var actorTd = infobox.
                        filter(function(i,el) {return $(this).html() == 'Played by' || $(this).html() == '<span style="white-space:nowrap">Played by</span>';}).
                        parent().find('td');

                    if(actorTd.html() != null) {

                        var actor = actorTd.html();
                        actor = actor.replace(/<a\s(.*?)>/g, '').trim();
                        actor = actor.replace(/<\/a>/g, '').trim();

                        actor = actor.replace(/\(\w+\)+/g, '').trim();
                        actor = actor.replace(/&apos;/g,"'");
                        actor = actor.replace(/&amp;/g,"&");

                        character.actor = actor;
                    }

                    // fetch culture
                    var cultureTd = infobox.
                        filter(function(i,el) {return $(this).html() == 'Culture' || $(this).html() == '<span style="white-space:nowrap">Culture</span>';}).
                        parent().find('td');

                    if(cultureTd.html() != null) {

                        var culture = cultureTd.html();
                        culture = culture.replace(/<a\s(.*?)>/g, '').trim();
                        culture = culture.replace(/<\/a>/g, '').trim();

                        culture = culture.replace(/\(\w+\)+/g, '').trim();
                        culture = culture.replace(/&apos;/g,"'");
                        culture = culture.replace(/&amp;/g,"&");

                        character.culture = culture;
                    }

                    //fetch father
                    var fatherTd = infobox.
                        filter(function(i,el) {return $(this).html() == 'Father' || $(this).html() == '<span style="white-space:nowrap">Father</span>';}).
                        parent().find('td');

                    if(fatherTd.html() != null) {

                        var father = fatherTd.html().split('<br>');
                        father[0] = father[0].replace(/<a\s(.*?)>/g, '').trim();
                        father[0] = father[0].replace(/<\/a>/g, '').trim();

                        father[0] = father[0].replace(/\(\w+\)+/g, '').trim();
                        father[0] = father[0].replace(/&apos;/g,"'");
                        father[0] = father[0].replace(/&amp;/g,"&");

                        character.father = father[0];
                    }


                    //fetch mother
                    var motherTd = infobox.
                        filter(function(i,el) {return $(this).html() == 'Mother' || $(this).html() == '<span style="white-space:nowrap">Mother</span>';}).
                        parent().find('td');

                    if(motherTd.html() != null) {

                        var mother = motherTd.html().split('<br>');
                        mother[0] = mother[0].replace(/<a\s(.*?)>/g, '').trim();
                        mother[0] = mother[0].replace(/<\/a>/g, '').trim();

                        mother[0] = mother[0].replace(/\(\w+\)+/g, '').trim();
                        mother[0] = mother[0].replace(/&apos;/g,"'");
                        mother[0] = mother[0].replace(/&amp;/g,"&");

                        character.mother = mother[0];
                    }

                    // fetch heir
                    var heirTd = infobox.
                        filter(function(i,el) {return $(this).html() == 'Heir' || $(this).html() == '<span style="white-space:nowrap">Heir</span>';}).
                        parent().find('td');

                    if(heirTd.html() != null) {

                        var heir = heirTd.html();
                        heir = heir.replace(/<a\s(.*?)>/g, '').trim();
                        heir = heir.replace(/<\/a>/g, '').trim();

                        heir = heir.replace(/\(\w+\)+/g, '').trim();
                        heir = heir.replace(/&apos;/g,"'");
                        heir = heir.replace(/&amp;/g,"&");

                        character.heir = heir;
                    }

                    // fetch spouse
                    character.spouse = [];
                    var spouseTd = infobox.
                        filter(function(i,el) {return $(this).html() == 'Spouse' || $(this).html() == 'Queen' || $(this).html() == 'Wife' || $(this).html() == 'Husband' || $(this).html() == 'King';}).
                        parent().find('td');

                    if(spouseTd.html() != null) {

                        var spouses = spouseTd.html().split('<br>');

                        spouses.forEach(function(spouse) {
                            // remove html tags and unnecessary spaces
                            spouse = spouse.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

                            // remove references like [1]
                            spouse = spouse.replace(/\(\w+\)+/g, '').trim();

                            spouse = spouse.replace(/&apos;/g,"'");
                            spouse = spouse.replace(/&amp;/g,"&");

                            character.spouse.push(spouse);
                        });
                    }

                    //fetch children
                    character.children = [];

                    var childTd = infobox.
                        filter(function(i, el) {return $(this).html() === 'Issue';}).
                        parent().find('td')
                    ;

                    if(childTd.html() !== null)
                    {
                        // get multiple titles
                        var children = childTd.html().split('<br>');
                        children.forEach(function(child) {
                            // remove html tags and unnecessary spaces
                            child = child.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

                            // remove references like [1]
                            child = child.replace(/\[\d+\]+/g, '');

                            child = child.replace(/&apos;/g,"'");
                            child = child.replace(/&amp;/g,"&");

                            character.children.push(child);
                        });
                    }

                    //fetch allegiance
                    character.allegiance = [];
                    var allegianceTd = infobox.
                        filter(function(i, el) {return $(this).html() === 'Allegiance';}).
                        parent().find('td')
                    ;

                    if(allegianceTd.html() !== null)
                    {
                        var allegiances = allegianceTd.html().split('<br>');

                        var house = allegiances[0].replace(/\*?<(?:.|\n)*?>/gm, '').trim();
                        house = house.replace(/\(\w+\)+/g, '').trim();
                        character.house = house

                        allegiances.forEach(function(allegiance) {
                            allegiance = allegiance.replace(/\*?<(?:.|\n)*?>/gm, '').trim();

                            allegiance = allegiance.replace(/\(\w+\)+/g, '').trim();

                            allegiance = allegiance.replace(/&apos;/g,"'");
                            allegiance = allegiance.replace(/&amp;/g,"&");

                            character.allegiance.push(allegiance);
                        });
                    }

                    //fetch house
                    var houseTd = infobox.
                        filter(function(i,el) {return $(this).html() == 'Royal House' || $(this).html() == '<span style="white-space:nowrap">Royal House</span>';}).
                        parent().find('td');

                    if(houseTd.html() != null) {

                        var house = houseTd.html();
                        house = house.replace(/<a\s(.*?)>/g, '').trim();
                        house = house.replace(/<\/a>/g, '').trim();

                        house = house.replace(/\(\w+\)+/g, '').trim();

                        house = house.replace(/&apos;/g,"'");
                        house = house.replace(/&amp;/g,"&");

                        character.house = house;
                    }


                    // fetch birthdate
                    var bornTd = infobox.
                        filter(function(i, el) {return $(this).html() === 'Born' || $(this).html() === 'Born in';}).
                        parent().find('td')
                        ;

                    if(bornTd.html() !== null) {
                        var born = bornTd.html();

                        var bornPlace = born.replace(/<[^>]*>/g, '');
                        var checkBornAt = bornPlace.match(/at/g);

                        if(checkBornAt != null) {
                            bornPlace = bornPlace.replace(/.*(?=at)/g,'');
                            bornPlace = bornPlace.replace(/\[.*?\]/g,'');
                            bornPlace = bornPlace.replace(/at&#xA0;/g,'');
                            bornPlace = bornPlace.replace(/at /g,'');
                            bornPlace = bornPlace.replace(/\n/g,'');
                            bornPlace = bornPlace.replace(/\(\w+\)+/g, '').trim();

                            bornPlace = bornPlace.replace(/&apos;/g,"'");
                            bornPlace = bornPlace.replace(/&amp;/g,"&");
                            character.placeOfBirth = bornPlace;
                        }
                        
                        

                        var isBirthDate = false;
                        if(born.indexOf('AC') > -1) {
                            var bornAC = born.match(/\d+ AC/);
                            if(bornAC !== null) {
                                born = bornAC[0].replace(/\D/g,'');
                            }
                            isBirthDate = true;
                        }
                        if(born.indexOf('BC') > -1) {
                            var bornBC = born.match(/\d+ BC/);
                            if(bornBC !== null) {
                                born = 0 - bornBC[0].replace(/\D/g,'');
                            }
                            isBirthDate = true;
                        }
                        if(isBirthDate){
                            character.dateOfBirth = born;
                        }
                    }

                    // fetch dateOfDeath
                    var diedTd = infobox.
                        filter(function(i, el) {return $(this).html() === 'Died' || $(this).html() === 'Died in';}).
                        parent().find('td')
                    ;

                    if(diedTd.html() !== null) {
                        var died = diedTd.html();
                        var isDead = false;

                        var deathPlace = died.replace(/<[^>]*>/g, '');
                        var checkDeathAt = deathPlace.match(/at/g);

                        if(checkDeathAt != null) {
                            deathPlace = deathPlace.replace(/.*(?=at)/g,'');
                            deathPlace = deathPlace.replace(/\[.*?\]/g,'');
                            deathPlace = deathPlace.replace(/at&#xA0;/g,'');
                            deathPlace = deathPlace.replace(/at /g,'');
                            deathPlace = deathPlace.replace(/\n/g,'');
                            deathPlace = deathPlace.replace(/\(\w+\)+/g, '').trim();

                            deathPlace = deathPlace.replace(/&apos;/g,"'");
                            deathPlace = deathPlace.replace(/&amp;/g,"&");
                            character.placeOfDeath = deathPlace;
                        }

                        if(died.indexOf('AC') > -1) {
                            var diedAC = died.match(/\d+ AC/);
                            if(diedAC !== null) {
                                died = diedAC[0].replace(/\D/g,'');
                            }
                            isDead = true;
                        }

                        if(died.indexOf('BC') > -1) {
                            var diedBC = died.match(/\d+ BC/);
                            if(diedBC !== null) {
                                died = 0 - diedBC[0].replace(/\D/g,'');
                            }
                            isDead = true;
                        }

                        if(isDead) {
                            character.dateOfDeath = died;
                        }
                    }
                }
                callback(character);
            });
        },

        /*
         * Call when you want to fetch all house information
         */
        getAll: function (callback) {
            var scraper = require("./characters");
            scraper.getAllNames(function (characters) {
                var charactersCollection = [];
                //var testCharacter = ['Bran Stark','Petyr Baelish','Joffrey Baratheon','Tyrion Lannister','Arya Stark','Jaime Lannister','Tommen Baratheon','Stannis Baratheon','Theon Greyjoy','Eddard Stark','Jon Snow','Daenerys Targaryen','Cersei Lannister']

                console.log(characters.length);
                async.each(characters, function(character, cb){
                    scraper.get(character, function(char) {
                        console.log('Fetched ' + char.name);
                        charactersCollection.push(char);
                        console.log("Still " + (characters.length - charactersCollection.length) + " characters to fetch.");
                        cb();
                    });
                },
                function(err) {
                    console.log('Finished scraping.');
                    callback(charactersCollection);
                });
            });
        },

        /*
         * Returns a list of character names
         */
        getAllNames: function (callback) {

            //Setup the mediawiki bot
            var bot = require("nodemw");

            var client = new bot({
                server: "awoiaf.westeros.org",
                path: "/api.php"
            });
            var params = {
                action: "parse",
                page: "List_of_characters",
                format: "json"
            };

            var characters = [];
            //Iterate through all the Characters

            console.log("Loading all character names from the wiki. This might take a while");
            client.api.call(params, function (err, info, next, data) {
                var $ = HtmlParser.load(data.parse.text["*"]);
                var allLis = $('li');

                var name;
                allLis.each(function() {
                    name = $(this).find('a').first().attr("title").replace(/_/g,' ');
                    if(name.indexOf('House ') < 0) {
                        console.log(name);
                        characters.push(name);
                    }
                });

                console.log("All character names loaded");
                callback(characters);
            });
        },
        scrapToFile: function (cacheFile, scraperFunction, callback) {
            console.log('Scrapping from wiki. May take a while..');
            scraperFunction(function (data) {
                data = {'data': data, createdAt: new Date()};
                console.log('Writing results into cache file "' + cacheFile + '"..');
                jsonfile.writeFile(cacheFile, data,{'spaces':2}, function (err) {
                    callback(err, data);
                });
            });
        }
    };
}());
