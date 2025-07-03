import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./Provider/AuthProvider";
import MainLayout from "./Layouts/MainLayout";
import Home from "./Pages/Home/Home";

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
        {/* <Routes></Routes> */}
        {/* Home Page Layout */}
        {/* <Route element={<HomePageLayout />}>
          <Route path="/" element={<Home />} />
        </Route> */}
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
