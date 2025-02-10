import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "@/pages/Home.tsx";
import BillManagement from "@/pages/BillManagement";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:billId" element={<BillManagement />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
