const express = require("express");
const app = express();
const scrape = require("./scrape");
const cors = require("cors");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());

app.get("/movies/:page", (req, res) => {
  scrape.getMovies(req.params.page).then((movies) => {
    res.json(movies);
  });
});


app.get("/stream/:title", (req, res) => {
  scrape.getMovieStream(req.params.title).then((links) => {

    res.json(links);

  }).catch(err => console.log(err));
});

app.get("/movies/indian/:page", (req, res) => {
  const { page } = req.params;
  scrape
    .getIndianMovies(page)
    .then((movies) => {
      console.log(movies);
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/movies/search/:title", (req, res) => {
  scrape.searchMovies(req.params.title).then((results) => {
    res.json(results);
  });
});
app.get("/movie/:title", (req, res) => {
  scrape.getMovie(req.params.title).then((results) => {
    res.json(results);
  });
});

app.get("/series/:page", (req, res) => {
  scrape.getSeries(req.params.page).then((tvShows) => {
    res.json(tvShows);
  });
});

app.get("/series/search/:title", (req, res) => {
  scrape.searchSeries(req.params.title).then((results) => {
    res.json(results);
  });
});

app.get("/serie/episodes/:title", (req, res) => {
  let title = req.params.title;
  title = title.replace("’", "");
  scrape.getSerieEpisodes(title).then((tvShows) => {
    res.json(tvShows);
  });
});

app.get("/serie/episode/:title/:s/:e", (req, res) => {
  console.log(req.params);
  const title = req.params.title.replace("’", "");
  scrape.getEpisode(title, req.params.s, req.params.e).then((episode) => {
    res.json(episode);
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Is running on Port ${port}`);
});
