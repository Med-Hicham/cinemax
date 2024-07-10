import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
const KEY = "4cf66cf";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//4cf66cf
//f84fc31d
export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  // we use our Custom hook that does the fetching and returns the states that we want
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  // set the initial value dynamically using a callback function (here we grab the stored data from the local storage)

  /* // because we specified an empty array as dependency array
  useEffect(function () {
    console.log("After initial Render");
  }, []);

  // because we did not specify the dependency arra
  useEffect(function () {
    console.log("After every render");
  });
  // because its in the top level code of the component
  console.log("During each Render");
  useEffect(function () {
    console.log("After every render"),[query]});
  */
  function handleSelectMovie(id) {
    // if the selected id is equal to the newly selected id then return null (close the movie because its the same) otherwise set the state to the newly selected ID
    setSelectedId((curId) => (curId === id ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatch(movie) {
    // always do not mutate the original array
    setWatched((watched) => [...watched, movie]);

    // store the watched list in the local storage
    // here we spread the watch list and added the current movie, because when mounting the watch list is empty
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  // remove the movie from the list
  function handleDelete(id) {
    setWatched((watched) => watched.filter((mov) => mov.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} onSetQuery={setQuery} />
        <Numresults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                isLoading={isLoading}
                onDelete={handleDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🎥</span>
      <h1 className="logo-name-heading">
        Cine<span className="logo-name">Max</span>
      </h1>
    </div>
  );
}

function Numresults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Search({ query, onSetQuery }) {
  // crete the Ref and then linkit in the JSX with the Element that we want
  const inputEl = useRef(null);
  // we abstracted all the code that is commented below into this function
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    onSetQuery("");
  });

  /*useEffect(
    function () {
      function callback(e) {
        // if the search bar is already focused then return and do not clear the list
        if (document.activeElement === inputEl.current) return;
        // if the pressed key is Enter
        if (e.code === "Enter") {
          // focus on the stored value that we stored in Ref (here the stored value is a DOM element thats why we could use focus())
          inputEl.current.focus();
          // clear the list from the movies
          onSetQuery("");
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
    },
    [onSetQuery]
  );*/
  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   //focusing on the element
  //   el.focus();
  // }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

/*function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/
function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // create as state that will track the userRating, and it setter as a prop in the starRating component (user API)
  const [userRating, setUserRating] = useState("");
  //check if the movie is already on the list
  const isWatched = watched.map((mov) => mov.imdbID).includes(selectedId);
  // the ref that wil count how many times the user rate a movie before submiting the final rating
  const countRef = useRef(0);

  useEffect(
    function () {
      // we only increment when there is a rating
      // increment the countref value each time the user rate (when the userRating state update)
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  // get the user rating from the current selected movie, we used the optional chaining because we do not know yet if we added the movie or not
  const watchedUserrating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  //we destructure the data out of the movie object (movie = data) because we wanted to change the properties name

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  //create the handler to add the movie to watched list, this handle function will use the handle function that we recieved from props
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId, // set a new property called imdbID to the current selected ID
      title, // store the title variable with its value as a key:value pairs
      year,
      poster,
      imdbRating: Number(imdbRating), //convert the IMDB rating to a number we will use it in statistics
      runtime: Number(runtime.split(" ").at(0)), // take only the number of minutes from the runtime string and convert it to a number
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    //close the movie interface so that the list of watched movies is displayed
    onCloseMovie();
  }
  useKey("Escape", onCloseMovie);
  // Listening for the Key press event
  /*useEffect(
    function () {
      //refactor the event handler
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      // add event listener
      document.addEventListener("keydown", callback);
      // the cleanup function
      return function () {
        //remove the event listener
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );*/

  // useEffect to fetch data and execute on each update on SelectedId state
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();
        // update the movie state by assigning  the selected movie to the state
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      // return if the title is undefined
      if (!title) return;
      document.title = `Movie | ${title}`;

      // the cleanup function
      return function () {
        document.title = "CineMax";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview ">
              <h2>{title}</h2>
              <p>
                {released}&bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            {!isWatched ? (
              <>
                <StarRating
                  maxRating={10}
                  size={32}
                  onSetRating={setUserRating}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    Add to List
                  </button>
                )}{" "}
              </>
            ) : (
              <p>You Rated this Movie ⭐{watchedUserrating}</p>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
