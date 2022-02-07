import * as React from "react";
import * as ReactDOM from "react-dom";
import Quiz from "./Quiz";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Quiz />
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
