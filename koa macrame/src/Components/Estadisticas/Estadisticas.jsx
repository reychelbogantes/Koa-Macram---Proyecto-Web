import React from 'react'

import PolarVentasDia from "./PolarVentasDia";
import HalfDoughnutOrdenes from './HalfDoughnutOrdenes';
import NightingaleUsuarios from './NightingaleUsuarios';

function Estadisticas() {
  return (
    <div>

      <div className="estadisticas-container">
      <h1>📊 Estadísticas del Panel</h1>

      <section className="grafica">
        <h2>Dias y productos mas vendidos</h2>
        <PolarVentasDia />
      </section>
      <section>
        <h2>Grafica de Pedidos</h2>
        <HalfDoughnutOrdenes/>
      </section>
      <section>
        <h2>Promedio de registros de usuarios</h2>
        <NightingaleUsuarios />
      </section>

     
    </div>


    </div>
  )
}

export default Estadisticas
