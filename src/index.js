import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/*function Test() {
  const [movieRating, setmovieRating] = useState(0);
  return (
    <div>
      <StarRating
        maxRating={7}
        color="orangered"
        onSetRating={setmovieRating}
      />
      <p> This Movie was rated {movieRating} stars</p>
    </div>
  );
}*/
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/*<StarRating maxRating={10} />
    <StarRating
      maxRating={4}
      messages={["bad", "average", "good", "perfect"]}
      color={"pink"}
      defaultRating={3}
    />
<Test />*/}
  </React.StrictMode>
);
