import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";

import Shopping from "./Shopping";
import Inventory from "./Inventory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
}
