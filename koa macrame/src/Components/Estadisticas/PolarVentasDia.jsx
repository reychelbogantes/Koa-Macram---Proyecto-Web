import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getFacturas } from "../../Services/Servicios";

export default function PolarVentasDia() {
  const [option, setOption] = useState({});
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        // --- 1️⃣ Ventas agrupadas por día de la semana ---
        const facturas = await getFacturas();
        const ventasSemana = agruparVentasPorDiaSemana(facturas);

        const diasSemana = ventasSemana.map(d => d.dia);
        const totalesSemana = ventasSemana.map(d => d.total);

        // Resumen de ventas (total + promedio + día con más ventas)
        const totalVentas = totalesSemana.reduce((a,b) => a + b, 0);
        const promedio = (totalVentas / totalesSemana.length).toFixed(2);
        const maxVentas = Math.max(...totalesSemana);
        const diaMax = ventasSemana.find(d => d.total === maxVentas)?.dia;

        setResumen({
          total: totalVentas,
          promedio,
          diaMax,
          max: maxVentas
        });

        // --- 2️⃣ Top 5 productos más vendidos ---
        const productosVendidos = contarProductosMasVendidos(facturas)
          .sort((a,b) => b.cantidad - a.cantidad) // orden descendente
          .slice(0,5);                           // solo los 5 primeros

        const nombresProd = productosVendidos.map(p => p.nombre);
        const cantidades = productosVendidos.map(p => p.cantidad);

        // --- 3️⃣ Configuración con 2 polares ---
        setOption({
          tooltip: {},
          angleAxis: [
            {
              type: 'category',
              polarIndex: 0,
              startAngle: 90,
              endAngle: 0,
              data: diasSemana              // ✅ Ventas agrupadas por día de la semana
            },
            {
              type: 'category',
              polarIndex: 1,
              startAngle: -90,
              endAngle: -180,
              data: nombresProd             // ✅ Top 5 productos más vendidos
            }
          ],
          radiusAxis: [
            { polarIndex: 0 },
            { polarIndex: 1 }
          ],
          polar: [{}, {}],
            toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              type: 'bar',
              polarIndex: 0,
              data: totalesSemana,
              coordinateSystem: 'polar',
              name: 'Ventas por día de la semana',
              roundCap: true,
              itemStyle: { color: '#e5b3f3' }
            },
            {
              type: 'bar',
              polarIndex: 1,
              data: cantidades,
              coordinateSystem: 'polar',
              name: 'Top 5 productos más vendidos',
              roundCap: true,
              itemStyle: { color: '#99a66eff' }
            }
          ],
          legend: { show: true, bottom: 0 }
        });
      } catch (err) {
        console.error("Error cargando datos de estadísticas:", err);
      }
    }
    cargarDatos();
  }, []);

  return (
    <div style={{ width: "100%", marginBottom: "2rem" }}>
      {/* Gráfica con 2 polares */}
      <div style={{ height: 400 }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>

      {/* Resumen debajo */}
      <div style={{
        background: "#f4f4f8",
        padding: "1rem",
        borderRadius: "8px",
        marginTop: "1rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>
        {resumen ? (
          <>
            <h3 style={{marginTop:0}}>Resumen de ventas</h3>
            <p><strong>Total vendido:</strong> ${resumen.total.toLocaleString()}</p>
            <p><strong>Promedio diario:</strong> ${resumen.promedio.toLocaleString()}</p>
            <p><strong>Día con más ventas:</strong> {resumen.diaMax} (${resumen.max.toLocaleString()})</p>
          </>
        ) : (
          <p>Cargando resumen…</p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   Helpers
--------------------------------------------------- */

// ✅ Agrupa las ventas por día de la semana (Lunes..Domingo)
function agruparVentasPorDiaSemana(facturas) {
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const porDia = {};

  facturas.forEach(f => {
    const fecha = new Date(f.fecha);
    const diaNombre = dias[fecha.getDay()]; // 0=Domingo
    porDia[diaNombre] = (porDia[diaNombre] || 0) + (f.total || 0);
  });

  // Devuelve array ordenado Lunes..Domingo
  const orden = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  return orden.map(dia => ({
    dia,
    total: porDia[dia] || 0
  }));
}

// ✅ Cuenta los productos más vendidos directamente de Facturacion
function contarProductosMasVendidos(facturas) {
  const contador = {};

  facturas.forEach(f => {
    (f.productos || []).forEach(p => {
      const key = p.id;
      if (!contador[key]) {
        contador[key] = { nombre: p.nombre, cantidad: 0 };
      }
      contador[key].cantidad += p.cantidad;
    });
  });

  return Object.values(contador);
}
