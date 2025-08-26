import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import { Search } from "./search";

const App = () => {
  return (
    <>
      <h1>Yoop Productions Beta Search</h1>
      <Search />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
