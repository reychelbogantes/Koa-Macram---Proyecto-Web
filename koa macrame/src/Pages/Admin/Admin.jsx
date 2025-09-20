import React from 'react'
import MenuIzquierdo from '../../Components/MenuIzquierdo/MenuIzquierdo'
import { Outlet } from "react-router-dom";


import './Admin.css';
function Admin() {
  return (
    <div>
      <MenuIzquierdo/>
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <Outlet />
      </div>

    </div>
  )
}

export default Admin