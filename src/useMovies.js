import { useEffect, useState } from "react";
const KEY = "4cf66cf";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  //const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      // init the controller
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          //display the loader by setting its state to true
          setIsLoading(true);
          //reseting the Error to avoid rerendering the error
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal } //pass the config object as second argument to fetch()
          );
          //throw an error if the requests failed
          if (!res.ok)
            throw new Error("Something went Wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error(data.Error);
          setMovies(data.Search);
          // reset the error msg
          setError("");
        } catch (err) {
          // if the error is not an abortion error than render the  error to the UI
          if (err.name !== "AbortError") {
            console.log(err);
            setError(err.message);
          }
        } finally {
          // when the data are fetced hide the loader
          setIsLoading(false);
        }
      }
      // if there is no query we do not want any movie on the list and we do not want any error, and return without trying to fetch anything
      //query is a string this means it has length
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      //before we fetch the movie we close the currently displayed movie
      //handleCloseMovie();
      fetchMovies();

      //Cleanup Function
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  // always return the used states to catch them from the component that will use this hook
  return { isLoading, movies, error };
}
