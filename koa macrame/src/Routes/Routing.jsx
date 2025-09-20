import React from 'react'
import Login from '../Pages/Login/Login'
import Homepage from '../Pages/Homepage/Homepage'
import Registro from '../Pages/Registro/Registro'
import Admin from '../Pages/Admin/Admin'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Inventario from '../Components/Inventario/Inventario'
import ProductosAdmin from '../Components/ProductosAdmin/ProductosAdmin'

function Routing() {
  return (
    <div>
        <Router>    
            <Routes>    
                <Route path='/homepage' element={<Homepage/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/' element={<Login/>}/>
                <Route path='/registro' element={<Registro/>}/>
                <Route path='/admin' element={<Admin/>}/>
                <Route path='/inventario' element={<Inventario/>}/>
                <Route path='/productosadmin' element={<ProductosAdmin/>}/>
            </Routes>    
        </Router>

    </div>
  )
}

export default Routing