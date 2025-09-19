import React from 'react'
import Login from '../Pages/Login/Login'
import Homepage from '../Pages/Homepage/Homepage'
import Registro from '../Pages/Registro/Registro'
import Admin from '../Pages/Admin/Admin'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

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
            </Routes>    
        </Router>

    </div>
  )
}

export default Routing