// import React from 'react'
// import ReactDOM from 'react-dom/client'
// // import App from './App.jsx'
// import Routing from './routes/Routing'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//      <Routing/>
//   </React.StrictMode>,
// )



import React from "react";
import ReactDOM from "react-dom/client";
import Routing from "./routes/Routing";
import "./index.css";

import { Provider } from "react-redux";
import { store, persistor } from "./store/store"; // fixed path
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routing />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

