import "./index.css";

// React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Authentication Provider
import AuthProvider from "./Provider/AuthProvider";

// Layouts
import MainLayout from "./Layouts/MainLayout";

// Public Pages
import Home from "./Pages/(Public_Pages)/Home/Home";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Home Page Layout */}
            <Route element={<MainLayout />}>
              {/* Home Pages Link */}
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
        {/* <RouterProvider router={router} /> */}
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
