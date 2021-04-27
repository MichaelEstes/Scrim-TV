import React from "react";
import { injectGlobal } from "styled-components";
import routes from "./routes";
import { initUserContext } from "./global/utils/auth";

initUserContext();

injectGlobal`
  body {
    font-family: "Source Sans Pro", sans-serif;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    ::-webkit-scrollbar { 
      display: none; 
    }
  }
`;

const App = props => {
  return routes;
};

export default App;
