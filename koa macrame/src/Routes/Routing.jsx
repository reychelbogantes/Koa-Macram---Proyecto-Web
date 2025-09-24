import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from '../Pages/Login/Login'
import Homepage from '../Pages/Homepage/Homepage'
import Registro from '../Pages/Registro/Registro'
import Admin from '../Pages/Admin/Admin'
import TerminosCondiciones from '../Pages/TerminosCondiciones/TerminosCondiciones'
import PoliticaReembolso from '../Pages/TerminosCondiciones/PoliticaReembolso'
import Catalogo from '../Pages/Catalogo/Catalogo'
import Contactanos from '../Pages/Contactanos/Contactanos'

/* --- Componentes del panel admin --- */
import Inventario from '../Components/Inventario/Inventario'
import ProductosAdmin from '../Components/ProductosAdmin/ProductosAdmin'
import UsuariosAdmin from '../Components/UsuariosAdmin/UsuariosAdmin'
import ContactosAdmin from '../Components/ContactosAdmin/ContactosAdmin'
import FacturasAdmin from '../Components/FacturasAdmin/FacturasAdmin'
import OrdenesPendientes from '../Components/OrdenesPendientes/OrdenesPendientes'
import OrdenesCanceladas from '../Components/OrdenesCanceladas/OrdenesCanceladas'
import OrdenesFinalizadas from '../Components/OrdenesFinalizadas/OrdenesFinalizadas'


/* --- Otros --- */
import ProductoDetalle from '../Components/ProductoDetalle/ProductoDetalle'
import ProductosCatalogo from '../Components/ProductosCatalogo/ProductosCatalogo'
import Carrito from '../Pages/Carrito/Carrito'

function Routing() {
  return (
    <Router>    
      <Routes>    
        {/* Rutas públicas */}
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
        <Route path='/registro' element={<Registro/>}/>
        <Route path='/terminos-condiciones' element={<TerminosCondiciones/>}/>
        <Route path='/politica-reembolso' element={<PoliticaReembolso/>}/>
        <Route path='/catalogo' element={<Catalogo/>}/>
        <Route path='/contacto' element={<Contactanos/>}/>
        <Route path='/producto/:id' element={<ProductoDetalle/>}/>
        <Route path='/producto' element={<ProductosCatalogo/>}/>
        <Route path='/carrito' element={<Carrito/>}/>

        {/* Rutas anidadas del panel de administración */}
        <Route path='/admin' element={<Admin/>}>
          {/* 👇 Todo esto aparecerá dentro del <Outlet /> de Admin */}
          <Route index element={<Admin />} />                {/* /admin */}

          <Route path='inventario' element={<Inventario/>} />                {/* /admin */}
          <Route path='productos' element={<ProductosAdmin/>} />  {/* /admin/productos */}
          <Route path='usuarios' element={<UsuariosAdmin/>} />    {/* /admin/usuarios */}
          <Route path='contactos' element={<ContactosAdmin/>} />  {/* /admin/contactos */}
          <Route path='facturas' element={<FacturasAdmin/>} />    {/* /admin/facturas */}
          <Route path='ordenes-pendientes' element={<OrdenesPendientes/>} />
          <Route path='ordenes-canceladas' element={<OrdenesCanceladas/>} />
          <Route path='ordenes-finalizadas' element={<OrdenesFinalizadas/>} />
        </Route>
      </Routes>    
    </Router>
  )
}

export default Routing
