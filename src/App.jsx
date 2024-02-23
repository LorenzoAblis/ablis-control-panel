import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style.css";

import Shopping from "./Shopping";
import Inventory from "./Inventory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/shopping" replace />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
}
