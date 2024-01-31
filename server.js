// import dependencies
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// create a schema
const schema = buildSchema(`
  enum Genre {
    Action
    Comedy
    Drama
    SciFi
  }

  type Movie {
    title: String!
    genre: Genre!
    rating: Float!
    runtime: Int!
  }

  type DieRoll {
    total: Int!
    sides: Int!
    rolls: [Int!]!
  }

  type Query {
    allMovies: [Movie!]!
    getMovie(index: Int!): Movie
    firstMovie: Movie
    getRandomMovie: Movie
    countMovies: Int
    moviesInRange(start: Int!, count: Int!): [Movie!]!
    getMoviesByGenre(genre: Genre!): [Movie!]!
    allGenres: [Genre!]!
    getMovieRuntime(index: Int!): Int!
    getRoll(sides: Int!, rolls: Int!): DieRoll!
  }

  type Mutation {
    addMovie(title: String!, genre: String!, rating: Float!, runtime: Int!): Movie!
    updateMovie(index: Int!, title: String, genre: String, rating: Float, runtime: Int): Movie
    deleteMovie(index: Int!): Movie
  }
`);

// define a resolver
const movieList = [
  { title: 'Inception', genre: 'SciFi', rating: 4.5, runtime: 148 },
  { title: 'The Dark Knight', genre: 'Action', rating: 4.8, runtime: 152 },
  { title: 'Pulp Fiction', genre: 'Drama', rating: 4.7, runtime: 154 },
  { title: 'In The Mood For Love', genre: 'Drama', rating: 4.9, runtime: 98 },
  { title: 'Eternal Sunshine of the Spotless Mind', genre: 'Drama', rating: 4.8, runtime: 108 },
  { title: 'Past Lives', genre: 'Drama', rating: 4.9, runtime: 120 },
  { title: 'Barbie', genre: 'Comedy', rating: 4.9, runtime: 95 },
  { title: 'The Shawshank Redemption', genre: 'Drama', rating: 4.7, runtime: 142 },
  { title: 'The Godfather', genre: 'Drama', rating: 4.7, runtime: 175 },
  { title: 'Forrest Gump', genre: 'Drama', rating: 4.3, runtime: 142 },
  { title: 'The Matrix', genre: 'SciFi', rating: 4.8, runtime: 136 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', genre: 'Action', rating: 4.0, runtime: 178 },
  { title: 'The Grand Budapest Hotel', genre: 'Comedy', rating: 4.2, runtime: 100 },
  { title: 'Interstellar', genre: 'SciFi', rating: 4.7, runtime: 169 },
];

const root = {
  allMovies: () => {
    return movieList;
  },
  getMovie: ({ index }) => {
    return movieList[index];
  },
  firstMovie: () => {
    return movieList[0];
  },
  getRandomMovie: () => {
    const randomIndex = Math.floor(Math.random() * movieList.length);
    return movieList[randomIndex];
  },
  countMovies: () => {
    return movieList.length;
  },
  moviesInRange: ({ start, count }) => {
    return movieList.slice(start, start + count);
  },
  getMoviesByGenre: ({ genre }) => {
    return movieList.filter(movie => movie.genre === genre);
  },
  allGenres: () => {
    const uniqueGenres = [...new Set(movieList.map(movie => movie.genre))];
    return uniqueGenres;
  },
  getMovieRuntime: ({ index }) => {
    return movieList[index].runtime;
  },
  getRoll: ({ sides, rolls }) => {
    const rollsArray = Array.from({ length: rolls }, () => Math.floor(Math.random() * sides) + 1);
    const total = rollsArray.reduce((sum, roll) => sum + roll, 0);
    return {
      total,
      sides,
      rolls: rollsArray,
    };
  },

  // challenge 1 
  addMovie: ({ title, genre, rating, runtime }) => {
    const newMovie = { title, genre, rating, runtime };
    movieList.push(newMovie);
    return newMovie;
  },

  // challenge 2 
  updateMovie: ({ index, title, genre, rating, runtime }) => {
    const movieToUpdate = movieList[index];
    if (!movieToUpdate) {
      return null;
    }

    // update the fields that are not undefined
    movieToUpdate.title = title !== undefined ? title : movieToUpdate.title;
    movieToUpdate.genre = genre !== undefined ? genre : movieToUpdate.genre;
    movieToUpdate.rating = rating !== undefined ? rating : movieToUpdate.rating;
    movieToUpdate.runtime = runtime !== undefined ? runtime : movieToUpdate.runtime;

    return movieToUpdate;
  },

  // challenge 3
  deleteMovie: ({ index }) => {
    const deletedMovie = movieList[index];
    if (!deletedMovie) {
      return null;
    }

    // remove the movie from the list
    movieList.splice(index, 1);

    return deletedMovie;
  },
};

// create an express app
const app = express();

// define a route for GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

// start this app
const port = 4000;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});

// challenge 4
// mutation queries

// creating a new item:
// mutation {
//   addMovie(title: "New Movie", genre: "SciFi", rating: 4.5, runtime: 120) {
//     title
//     genre
//     rating
//     runtime
//   }
// }

// # read item from list
// query {
//   getMovie(index: 0) {
//     title
//     genre
//     rating
//     runtime
//   }
// }

// # updating an item
// mutation {
//   updateMovie(index: 0, title: "Updated Movie Title", genre: "Drama", rating: 4.8, runtime: 130) {
//     title
//     genre
//     rating
//     runtime
//   }
// }

// # deleting an item
// mutation {
//   deleteMovie(index: 0) {
//     title
//     genre
//     rating
//     runtime
//   }
// }
