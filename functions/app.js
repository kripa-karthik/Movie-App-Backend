const express = require('express');
const serverless=require("serverless-http");
const cors = require('cors');
const { v4: uuid } = require('uuid');

const data = require("../db/movies");

const app = express();
app.use(express.json());
app.use(cors());
const router=express.Router();

router.get('/', (req, res) => {
  res.send('Hello Express app!');
});

router.get('/api/movies', (req, res) => {
  console.log('movies data');
  // console.log(data);
  res.json(data);
});

router.get('/api/movies/search', (req, res) => {
  const query = req.query.s;
  const movie = data.filter(({ name, director_name, writter_name, cast_name }) => name.toLowerCase() === query.toLowerCase() || director_name.toLowerCase() === query.toLowerCase() || writter_name.split(",").find(name => name.toLowerCase() === query.toLowerCase()) || cast_name.split(",").find(name => name.toLowerCase() === query.toLowerCase()));
  res.json(movie);
})

router.get('/api/movies/genre', (req, res) => {
  const query = req.query.g;
  const movies = data.filter(({ genre }) => genre === query);
  res.json(movies);
})

router.get('/api/movies/rating', (req, res) => {
  const query = req.query.i;
  const movies = data.filter(({ imdb_rating }) => imdb_rating >= query);
  res.json(movies);
})

router.get('/api/movies/genres', (req, res) => {
  const genres = data.reduce((acc, cur) => {
    acc = [...acc, { id: uuid(), genre: cur.genre.split(",")[0] }]
    return acc
  }, [])
  console.log({ genres });
  const allGenres = genres.flatMap(movie => movie.genre);
  const uniqueGenres = [...new Set(allGenres)];
  console.log({ uniqueGenres });
  const genres1 = uniqueGenres.map(genre => ({ id: uuid(), genre }));
  console.log({ genres1 })
  res.json(genres1);
})


app.use('/.netlify/functions/app',router);
module.exports.handler=serverless(app);
 
const port=process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server started');
});







// const fs = require("fs");
// const { parse } = require("csv-parse");
// fs.createReadStream("functions/movies.csv")
//   .pipe(
//     parse({
//       delimiter: ",",
//       columns: true,
//       ltrim: true,
//     })
//   )
//   .on("data", function(row) {
//     console.log("Row read:", row);
//     data.push(row);
//   })
//   .on("error", function(error) {
//     console.log("Error while parsing CSV:", error.message);
//     console.log(error.message);
//   })
//   .on("end", function() {
//     console.log("Parsed CSV data");
//   });