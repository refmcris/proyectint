import logo from './logo.svg';
import React from 'react';
import './App.css';

import Register from './Components/Register';
import Landpage from './Components/Landpage';
import Carrusel from './Components/Carrusel';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './Components/Dashboard/sidebar';
import Equipos from './Components/Dashboard/equipos';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Carrusel />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register/>}/>
          <Route path="/admin/home" element ={<SideBar/>}/>
          <Route path="/admin/equipos" element={<Equipos/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
