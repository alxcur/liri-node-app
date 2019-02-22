require("dotenv").config();
var keys = require('./keys');
var moment = require('moment');
var inquirer = require('inquirer');
var axios = require('axios');


  let getMovie = (value) => {

    var key = require('./omdbkey');

    axios.get(`http://www.omdbapi.com/?i=tt3896198&apikey=2b902382`).then(
        function (response) {
            // console.log(response.data)
            if (response.data.Title === undefined) {
                console.log('This movie may not exist, try again.')
            } else {

                let movieInfo =
                    `
                MOVIES:
                * Movie Title: "${response.data.Title}"
                * Year: "${response.data.Year}"
                * IMDB Rating: "${response.data.Ratings[0].Value}"
                * Rotten Tomatoes Rating: "${response.data.Ratings[1].Value}"
                * Country(s) Produced: "${response.data.Country}"
                * Language(s): "${response.data.Language}"
                * Actors: "${response.data.Actors}"
                `;
                fs.appendFile('log.txt', movieInfo, (err) => {
                    if (err) throw err;
                })

                console.log(`* Movie Title: "${response.data.Title}",`);
                console.log(`* Year: "${response.data.Year}",`);
                console.log(`* IMDB Rating: "${response.data.Ratings[0].Value}",`);
                console.log(`* Rotten Tomatoes Rating: "${response.data.Ratings[1].Value}",`);
                console.log(`* Country(s) Produced: "${response.data.Country}",`);
                console.log(`* Language(s): "${response.data.Language}",`);
                console.log(`* Actors: "${response.data.Actors}",`);
            }
        }).catch(function (err) {
            if (err.response === undefined) {
                err.message = "OMDB couldn't find this movie, try again."
                console.log(err.message)
            }
        });
};