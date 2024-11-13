import logo from './logo.svg';
import React from 'react';
import './App.css';


import Landpage from './Components/Landpage';
import Carrusel from './Components/Carrusel';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './Components/Dashboard/sidebar';
import Equipos from './Components/Dashboard/equipos';
import Usuarios from './Components/Dashboard/usuarios';
import Usuarioequip from './Components/DashboardUsuarios/usuarioequip';
import SideBarus from './Components/DashboardUsuarios/sidebarus';
import Prestamos from './Components/DashboardUsuarios/prestamos';
import Misprestamos from './Components/DashboardUsuarios/misprestamos';
import Devprestamos from './Components/Dashboard/devprestamos';
import Recupcontra from './Components/DashboardUsuarios/recupcontra';
import Contrarecupe from './Components/DashboardUsuarios/contrarecupe';
import TabbedTable from './Components/Dashboard/devprestamos';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Perfiluser from './Components/DashboardUsuarios/perfiluser';
import { UserProvider } from './Components/DashboardUsuarios/UserContext';
import Charts from './Components/Dashboard/charts';
import RoleRoute from './Auth/RoleRoute';
import { AuthProvider } from './Auth/AuthContext';
import AccessDenied from './Common/Accesdenied';
import DasHome from './Components/Dashboard/DasHome';
import Layout from './Common/Layout';


function App() {
  return (
    <div>
      <UserProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Carrusel />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Rutas protegidas para admin */}
                <Route element={<RoleRoute requiredRole="admin" />}>
                  <Route path="/admin/home" element={<DasHome />} />
                  <Route path="/admin/equipos" element={<Equipos />} />
                  <Route path="/admin/usuarios" element={<Usuarios />} />
                  <Route path="/admin/prestamos" element={<TabbedTable />} />
                </Route>


              {/* Rutas protegidas para usuarios */}
              <Route element={<RoleRoute requiredRole="estudiante" />}>
                <Route path="/usuarios/home" element={<Usuarioequip />} />
                <Route path="/area-prestamos" element={<Prestamos />} />
                <Route path="/mis-prestamos" element={<Misprestamos />} />
                <Route path="/profile" element={<Perfiluser />} />
                <Route path="/recupcontra" element={<Recupcontra />} />
                <Route path="/contrarecupera" element={<Contrarecupe />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </UserProvider>
      
    </div>
  );
}

export default App;
