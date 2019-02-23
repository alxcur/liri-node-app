require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require('moment');

var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var song = process.argv[3];
var artist = process.argv[3];
var movie = process.argv[3];
var start = "\n] Hi, I am LIRI. [\n";
var end = "\n] -***********************- [\n";

switch (command) {
  case "concert-this":

    if (artist == null) {

      var text = (start + command + " :: " + artist + "\n" + "No concerts near you." + end);
      console.log("No concerts near you.");

      fs.appendFile("log.txt", text, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log.txt file.");
        }

      });

    } else {

      axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")

        .then(function (response) {

          console.log(artist + " | NEXT CONCERT:");
          console.log("Venue: " + response.data[0].venue.name);
          console.log("Location: " + response.data[0].venue.city);
          console.log("Date: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));

          var text = [start + command + " :: " + artist + "\n" + "Venue: " + response.data[0].venue.name + "\n" + "Location: " + response.data[0].venue.city + "\n" + "Date: " + moment(response.data[0].datetime).format("MM/DD/YYYY") + end];

          fs.appendFile("log.txt", text, function (err) {
            if (err) {
              console.log(err);
            } else {}
          });
        })
    }

    break;

  case "spotify-this-song":

    if (song == null) {
      if (command) {

        spotify.request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')

          .then(function (data) {

            var artists = data.artists[0].name;
            var songTitle = data.name;
            var songUrl = data.preview_url;
            var songAlbum = data.album.name;

            console.log("Artist(s): " + data.artists[0].name);
            console.log("The Song's Name: " + data.name);
            console.log("Spotify Preview Link: " + data.preview_url);
            console.log("Album: " + data.album.name);

            var text = [start + process.argv[2] + " :: " + process.argv[3] + "\n" + "Artist(s): " + artists + "\n" + "The Song's Name: " + songTitle + "\n" + "Spotify Preview Link: " + songUrl + "\n" + "Album: " + songAlbum + end];



            fs.appendFile("log.txt", text, function (err) {
              if (err) {
                console.log(err);
              } else {}
            });
          })
      }

    } else {

      if (command) {

        spotify.search({
            type: "track",
            query: song,
            limit: 10
          },

          function (err, data) {

            if (err) {
              console.log('Error occurred: ' + err);
              return;
            } else {

              var songInfo = data.tracks.items[0];
              var artists = songInfo.artists[0].name;
              var songTitle = songInfo.name;
              var songUrl = songInfo.preview_url;
              var songAlbum = songInfo.album.name;

              console.log("Artist(s): " + artists);
              console.log("The Song's Name: " + songInfo.name);
              console.log("Spotify Preview Link: " + songInfo.preview_url);
              console.log("Album: " + songInfo.album.name);

              fs.appendFile("log.txt", text, function (err) {

                if (err) {
                  console.log(err);
                } else {}

              });
            };
          })
      };
    }

    break;

  case "movie-this":

    if (movie == null) {

      axios.get("https://omdbapi.com/?t=mr.nobody&apikey=trilogy")

        .then(function (resp) {
          //console.log(resp.data);
          console.log("Movie: " + resp.data.Title);
          console.log("Year: " + resp.data.Year);
          console.log("IMDB Rating: " + resp.data.imdbRating);
          console.log("Rotten Tomatoes Rating: " + resp.data.Ratings[1].Value);
          console.log("Country: " + resp.data.Country);
          console.log("Language: " + resp.data.Language);
          console.log("Plot: " + resp.data.Plot);
          console.log("Actors: " + resp.data.Actors);

          var text = [start + process.argv[2] + " :: " + process.argv[3] + "\n" + "Movie: " + resp.data.Title + "\n" + "Year: " + resp.data.Year + "\n" + "IMDB Rating: " + resp.data.imdbRating + "\n" + "Rotten Tomatoes Rating: " + resp.data.Ratings[1].Value + "\n" + "Country: " + resp.data.Country + "\n" + "Language: " + resp.data.Language + "\n" + "Plot: " + resp.data.Plot + end];


          fs.appendFile("log.txt", text, function (err) {
            if (err) {
              console.log(err);
            } else {}
          });
        })
    } else {
      axios.get("https://omdbapi.com/?t=" + movie + "&apikey=trilogy")

        .then(function (resp) {
          console.log("Movie: " + resp.data.Title);
          console.log("Year: " + resp.data.Year);
          console.log("IMDB Rating: " + resp.data.imdbRating);
          console.log("Rotten Tomatoes Rating: " + resp.data.Ratings[1].Value);
          console.log("Country: " + resp.data.Country);
          console.log("Language: " + resp.data.Language);
          console.log("Plot: " + resp.data.Plot);
          console.log("Actors: " + resp.data.Actors);

          fs.appendFile("log.txt", text, function (err) {
            if (err) {
              console.log(err);
            } else {}
          });
        })
    }

    break;

  case "do-what-it-says":
    fs.readFile("random.txt", "utf8", function (error, data) {

      if (error) {
        return console.log(error);
      }

      var dataArr = data.split(",");
      var song = dataArr[1];

      spotify.search({
          type: "track",
          query: song,
          limit: 1
        },

        function (err, data) {
          if (err) {
            console.log('Error: ' + err);
            return;

          } else {
            var songInfo = data.tracks.items[0];
            var artists = songInfo.artists[0].name;
            var songTitle = songInfo.name;
            var songUrl = songInfo.preview_url;
            var songAlbum = songInfo.album.name;

            console.log("Artist(s): " + artists);
            console.log("Song: " + songInfo.name);
            console.log("URL: " + songInfo.preview_url);
            console.log("Album: " + songInfo.album.name);

            var text = [start + process.argv[2] + " :: " + artists + "\n" + "Song: " + songTitle + "\n" + "URL: " + songUrl + "\n" + "Album: " + songAlbum + end];


            fs.appendFile("log.txt", text, function (err) {
              if (err) {
                console.log(err);
              } else {}
            });
          };
        })
    });

    break;
  default:
    console.log("No Results.");
}
// end switch
