import { useEffect } from "react";
export function useKey(key, action) {
  // Listening for the Key press event
  useEffect(
    function () {
      //refactor the event handler
      function callback(e) {
        // we converted them toLowerCase to avoid errors
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
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
    [action, key]
  );
}
