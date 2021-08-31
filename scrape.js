const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { response } = require("express");

const BASE_URL = "https://www.movs4u.vip";
//Movies

function getMovieStream(title) {
  return fetch(
    `${BASE_URL}/movie/%D9%85%D8%AA%D8%B1%D8%AC%D9%85-${title}-%D9%81%D9%8A%D9%84%D9%85/`,
    { redirect: "follow", timeout: 3000 }
  )
    .then((response) => response.text())
    .then((body) => {
      let $ = cheerio.load(body);
      let sources = [];
      $(".getplay").each((_i, el) => {
        if (el.attribs["titlea"] !== "trailer") {
          sources.push(el.attribs["data-url"]);
        }
      });
    })
    .catch((err) => console.log(err));
}

function getMovies(num) {
  return fetch(`${BASE_URL}/movie/page/${num}/`)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const movies = [];
      $(".row .col-post-movie").each((_i, el) => {
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
      $(".row .col-post-movie").each((_i, el) => {
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
      return movies;
    })
    .catch((err) => {
      console.log(err);
    });
}

function searchMovies(title) {
  return fetch(`${BASE_URL}/movie/?search=${title}`)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const movies = [];
      $(".row .col-post-movie").each((_i, el) => {
        const element = $(el);

        movie = {
          img: element.find("img").attr("src"),
          title: element.find("h3 a").text(),
          link: element.find("a").attr("href"),
          rating: element.find(".rating").text(),
          quality: element.find(".quality").text(),
          description: element.find(".contenido p").text(),
        };
        movies.push(movie);
      });
      return movies;
    });
}

function getMovie(title) {
  let url = `${BASE_URL}/movie/%D9%85%D8%AA%D8%B1%D8%AC%D9%85-${title}-%D9%81%D9%8A%D9%84%D9%85/`;
  return fetch(url)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);

      const movie = {
        img: $(".single-poster img").attr("src"),
        title: $(".info-detail-single-title h3").text(),
        description: $(".info-detail-single .post-content").text(),
        streamLinks: $(".getplay")
          .map((_i, el) => {
            if (el.attribs["titlea"] !== "trailer") {
              return el.attribs["data-url"];
            }
          })
          .get(),
      };
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
      $(".row .col-post-movie").each((i, el) => {
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
  return fetch(`${BASE_URL}/tvshows/?search=${title}`)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const series = [];
      $(".row .col-post-movie").each((_i, el) => {
        const element = $(el);

        serie = {
          img: element.find("img").attr("src"),
          title: element.find("h3 a").text(),
          year: element.find(".year").text(),
        };
        series.push(serie);
      });
      return series;
    });
}

function getSerieEpisodes(title) {
  let uri = `${BASE_URL}/tvshows/${title}`;
  return fetch(uri)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);

      return Promise.all(
        $(".colsbox-5 .col-post-movie")
          .map(async (_, el) => {
            const element = $(el);
            const seasonLink = element.find(".fulllink").attr("href");

            const seasonPage = await fetch(seasonLink);
            const seasonPageText = await seasonPage.text();

            const $sp = cheerio.load(seasonPageText);

            return Promise.resolve(
              $sp(".col-post-movie")
                .map((_, epData) => {
                  const ep = $(epData);

                  const epNumber = ep.find("img").attr("alt");

                  const episode = {
                    episodetitle: ep.find(".movie-info h3 a").text(),
                    epNumber: epNumber.substr(epNumber.indexOf(":") + 1).trim(),
                  };

                  return episode;
                })
                .get()
            );
          })
          .get()
      )
        .then((seasons) => {
          seasons.forEach((season) => season.reverse());
          return [].concat.apply([], seasons);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
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
      $(".getplay").each((_, el) => {
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

getEpisode("legacies", 3, 1);

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
