import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      toastOptions={{
        success: {
          duration: 2000,
          position: "top-right",
        },
        error: {
          duration: 4000,
          position: "top-right",
        },
      }}
    />
  </React.StrictMode>
);
