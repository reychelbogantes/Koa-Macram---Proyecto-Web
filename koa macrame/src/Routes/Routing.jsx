import React from 'react'
import Login from '../Pages/Login/Login'
import Homepage from '../Pages/Homepage/Homepage'
import Registro from '../Pages/Registro/Registro'
import Admin from '../Pages/Admin/Admin'
import TerminosCondiciones from '../Pages/TerminosCondiciones/TerminosCondiciones'
import PoliticaReembolso from '../Pages/TerminosCondiciones/PoliticaReembolso'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Inventario from '../Components/Inventario/Inventario'
import ProductosAdmin from '../Components/ProductosAdmin/ProductosAdmin'
import UsuariosAdmin from '../Components/UsuariosAdmin/UsuariosAdmin';
import Catalogo from '../Pages/Catalogo/Catalogo'
import Contactanos from '../Pages/Contactanos/Contactanos';
import ContactosAdmin from '../Components/ContactosAdmin/ContactosAdmin';
import ProductoDetalle from '../Components/ProductoDetalle/ProductoDetalle'
import ProductosCatalogo from '../Components/ProductosCatalogo/ProductosCatalogo'
import Carrito from '../Pages/Carrito/Carrito'

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
                <Route path="/usuarios" element={<UsuariosAdmin />} />
                <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
                <Route path="/politica-reembolso" element={<PoliticaReembolso />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/contacto" element={<Contactanos />} />
                <Route path="/admin/contactos" element={<ContactosAdmin />} />
                <Route path="/producto/:id" element={<ProductoDetalle />} />
                <Route path="/producto" element={<ProductosCatalogo />} />
                <Route path="/carrito" element={<Carrito />} />

            </Routes>    
        </Router>

    </div>
  )
}

export default Routing