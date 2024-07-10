import { useState, useEffect } from "react";
// the key here is the name that we wil give to the object that we stored in the local storage
export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    // if there is something stored in the local then return it if there is nothing in the local storage return the initialState
    // we parse the JSON back to an Array
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      // we used watch direectly because the effect will rerun at the mount and  each time we update the watched
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
