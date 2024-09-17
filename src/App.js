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
import Usuarios from './Components/Dashboard/usuarios';
import Usuarioequip from './Components/DashboardUsuarios/usuarioequip';
import SideBarus from './Components/DashboardUsuarios/sidebarus';
import Prestamos from './Components/DashboardUsuarios/prestamos';


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
          <Route path="/admin/usuarios" element={<Usuarios/>}/>
          <Route path="/usuarios/home" element={<Usuarioequip/>}/>
          <Route path="/area-prestamos" element ={<Prestamos/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
