import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Flowbite } from "flowbite-react";

// Themes & Styles
import "./index.css";
import theme from "./flowbite-theme";

// --- IMPORT YOUR PAGES ---
import DashboardPage from "./pages/index";          // Your Dashboard
import LandingLogin from "./pages/landing-login";   // Your NEW Login Page

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element not found.");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <Routes>
          {/* RULE 1: If user goes to "/", show the Login Page */}
          <Route path="/" element={<LandingLogin />} />

          {/* RULE 2: If user goes to "/dashboard", show the Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* RULE 3: Redirect any unknown link back to Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Flowbite>
  </StrictMode>
);