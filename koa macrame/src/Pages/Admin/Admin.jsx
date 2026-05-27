import React, { useEffect} from 'react';
import MenuIzquierdo from '../../Components/MenuIzquierdo/MenuIzquierdo'
import { Outlet } from "react-router-dom";


import './Admin.css';
function Admin() {
   // Favicon y título dinámicos
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = `${import.meta.env.BASE_URL}logo.png`;
    document.title = "Adminitración | Koa Macramé";
  }, []);

  return (
    <div className='body-Admin'>
      <MenuIzquierdo/>
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <Outlet />
      </div>

    </div>
  )
}

export default Admin