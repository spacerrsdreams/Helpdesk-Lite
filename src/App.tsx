import "@/index.css";

import { Route, Routes } from "react-router";

import { Home } from "@/routes/home.route";

export function App() {
  return (
    <div className="flex h-full flex-col antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
