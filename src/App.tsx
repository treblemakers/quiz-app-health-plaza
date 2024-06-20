import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes/Routers";

import './App.scss'


const App: React.FC = () => {


  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default App;