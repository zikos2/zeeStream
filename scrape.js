const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { response } = require("express");


const BASE_URL = "https://www.movs4u.life";
//Movies

function getMovieStream(title) {
  return fetch(`${BASE_URL}/movie/%D9%85%D8%AA%D8%B1%D8%AC%D9%85-${title}-%D9%81%D9%8A%D9%84%D9%85/`, { redirect: 'follow', timeout: 5000 })
    .then(response => response.text())
    .then((body) => {
      let $ = cheerio.load(body);
      let link = $("#player-option-1").attr("data-url");


      if (link.includes("main_player")) {
        return fetch(link).then(response => response.text()).then(body => {

          $ = cheerio.load(body);
          link = $("meta").attr("content").slice(7);
          console.log(link);
          return fetch(link).then(response => response.text()).then(body => {
            console.log(body);
            $ = cheerio.load(body);
            let sources = [];
            $("source").each((i, el) => {
              const element = $(el);
              sources.push(element.attr("src"))

            })
            console.log(sources);
            return sources;


          })

        })

      } else {
        return fetch(link)
          .then(response => response.text())
          .then(body => {
            $ = cheerio.load(body);
            link = $("iframe").attr("src")
            return fetch(link).then(response => response.text()).then(body => {
              $ = cheerio.load(body);
              let sources = [];
              $("source").each((i, el) => {
                const element = $(el);
                sources.push(element.attr("src"))

              })
              console.log(sources);
              return sources;
            }).catch(err => console.log(err));
          }).catch(err => console.log(err));
      }


    }).catch(err => console.log(err));
}

function getMovies(num) {
  return fetch(`${BASE_URL}/movie/page/${num}/`)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const movies = [];
      $(".movies").each((i, el) => {
        const element = $(el);

        movie = {
          img: element.find("img").attr("src"),
          title: element.find("h3 a").html(),
          link: element.find("a").attr("href"),
          rating: element.find(".rating").text(),
          quality: element.find(".quality").text(),
          description: element.find(".texto").text(),
        };
        movies.push(movie);
      });
      console.log(movies)
      return movies;
    });
}

function getIndianMovies(num) {
  let uri = `${BASE_URL}/genre/india-افلام-هندية/page/${num}`;

  return fetch(encodeURI(uri))
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const movies = [];
      $(".movies").each((i, el) => {
        const element = $(el);

        movie = {
          img: element.find("img").attr("src"),
          title: element.find("h4").html(),
          link: element.find("a").attr("href"),
          rating: element.find(".rating").text(),
          quality: element.find(".quality").text(),
          description: element.find(".texto").text(),
        };
        movies.push(movie);
      });
      return movies;
    })
    .catch((err) => {
      console.log(err);
    });
}

function searchMovies(title) {
  return fetch(`${BASE_URL}/?s=${title}`)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const movies = [];
      $(".result-item article").each((i, el) => {
        const element = $(el);

        movie = {
          img: element.find(".thumbnail img").attr("src"),
          title: element.find(".title").text(),
          link: element.find("a").attr("href"),
          rating: element.find(".rating").text(),
          type: element.find(".image a span").text(),
          description: element.find(".contenido p").text(),
          year: element.find(".year").text(),
        };
        movies.push(movie);
      });
      return movies;
    });
}


function getMovie(title) {
  let url = `${BASE_URL}/movie/%D9%85%D8%AA%D8%B1%D8%AC%D9%85-${title}-%D9%81%D9%8A%D9%84%D9%85/`;

  console.log(url);
  return fetch(url)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);

      const img = $(".sheader .poster img").attr("src");
      const tagline = $(".data .tagline").text();
      const description = $('.info div[itemprop="description"]').text();
      const date = $(".data .date").text();
      const country = $(".data .country").text();
      const runtime = $(".data .runtime").text();

      const streamLinks = [];
      $("#playeroptions li").each((i, el) => {
        const element = $(el);
        const link = element.attr("data-url");
        streamLinks.push(link);
      });
      console.log(streamLinks);

      const movie = {
        img,
        tagline,
        description,
        date,
        country,
        runtime,
        streamLinks,
      };
      console.log(movie);
      return movie;
    })
    .catch((err) => {
      console.log(err);
    });
}

//Series
function getSeries(num) {
  return fetch(`${BASE_URL}/tvshows/page/${num}`)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      let tvShows = [];
      $(".tvshows").each((i, el) => {
        const element = $(el);

        const tvShow = {
          img: element.find("img").attr("src"),
          title: element.find("h3 a").text(),
          rating: element.find(".rating").text(),
        };
        tvShows.push(tvShow);
      });
      return tvShows;
    })
    .catch((err) => {
      console.log(err);
    });
}

function searchSeries(title) {
  return fetch(`${BASE_URL}/?s=${title}`)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const series = [];
      $(".result-item article").each((i, el) => {
        const element = $(el);

        serie = {
          img: element.find(".thumbnail img").attr("src"),
          title: element.find(".title a").text(),
          link: element.find("a").attr("href"),
          rating: element.find(".rating").text(),
          type: element.find(".image a span").text(),
          description: element.find(".contenido p").text(),
          year: element.find(".year").text(),
        };
        series.push(serie);
      });
      return series;
    });
}
function getSerieEpisodes(title) {
  console.log(title);
  let uri = `${BASE_URL}/tvshows/${title}`;
  return fetch(uri)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      let episodes = [];
      $(".se-c li").each((i, el) => {
        const element = $(el);
        let episode = {
          episodeTitle: element.find(".episodiotitle a").text(),
          link: element.find(".episodiotitle a").attr("href"),
          epNumber: element.find(".numerando").text(),
          img: element.find("img").attr("src"),
        };

        episodes.push(episode);
      });
      console.log(episodes);
      return episodes;
    });
}

function getEpisode(title, s, e) {
  return fetch(
    `${BASE_URL}/episodes/%D9%85%D8%AA%D8%B1%D8%AC%D9%85%D8%A9-${title}-${s}x${e}-%D8%A7%D9%84%D8%AD%D9%84%D9%82%D9%87/`
  )
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const streamLinks = [];
      $("#playeroptions li").each((i, el) => {
        const element = $(el);
        const link = element.attr("data-url");
        streamLinks.push(link);
      });
      const episodeDetails = {
        streamLinks: streamLinks,
        number: $(".epih1").text(),
        title: $(".epih3").text(),
        resume: $(".wp-content p").text(),
      };
      console.log(episodeDetails);
      return episodeDetails;
    });
}


getMovieStream("ana");

module.exports = {
  getMovieStream,
  getMovies,
  searchMovies,
  getMovie,
  getSerieEpisodes,
  getSeries,
  getEpisode,
  searchSeries,
  getIndianMovies,
};
