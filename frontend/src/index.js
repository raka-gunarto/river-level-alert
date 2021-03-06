import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import axios from "axios";
axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://riverwaterlevel.rakagunarto.com/api"
    : "http://localhost:3000/api";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorkerRegistration.register();
