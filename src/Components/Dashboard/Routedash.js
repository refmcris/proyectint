import React from 'react'
import{BrowserRouter,Routes,Route} from 'react-router-dom'

import SideBar from './sidebar'
import Equipos from './equipos'


function RouteDash() {
  return (
    <div>
        <BrowserRouter>
      <Routes>
        <Route path="/admin/home" element ={<SideBar/>}/>
        <Route path="/admin/equipos" element={<Equipos/>}/>


      </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default RouteDash
