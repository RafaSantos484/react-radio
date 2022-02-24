import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./screens";
import Register from "./screens/register";
import Teste from "./screens/teste";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/teste" element={<Teste />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;