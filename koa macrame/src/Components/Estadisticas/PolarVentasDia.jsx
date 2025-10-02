import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getFacturas } from "../../Services/Servicios";
import "./PolarVentasDia.css"; 

function PolarVentasDia() {
  const [option, setOption] = useState({});
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const facturas = await getFacturas();
        const ventasSemana = agruparVentasPorDiaSemana(facturas);// ventas totales por día de la semana

        const diasSemana = ventasSemana.map(d => d.dia);// nombres de días
        const totalesSemana = ventasSemana.map(d => d.total);// totales por día

        const totalVentas = totalesSemana.reduce((a,b) => a + b, 0); // suma total
        const promedio = (totalVentas / totalesSemana.length).toFixed(2);// promedio diario
        const maxVentas = Math.max(...totalesSemana);// max diario
        const diaMax = ventasSemana.find(d => d.total === maxVentas)?.dia;// dia con max
        
        // actualizar resumen
        setResumen({
          total: totalVentas,
          promedio,
          diaMax,
          max: maxVentas
        });

        const productosVendidos = contarProductosMasVendidos(facturas)// contar productos vendidos
          .sort((a,b) => b.cantidad - a.cantidad)
          .slice(0,5);

        const nombresProd = productosVendidos.map(p => p.nombre);// nombres de productos
        const cantidades = productosVendidos.map(p => p.cantidad);// cantidades vendidas

       // configurar gráfica
        setOption({
          tooltip: {},
          angleAxis: [
            {
              type: "category",
              polarIndex: 0,
              startAngle: 90,
              endAngle: 0,
              data: diasSemana
            },
            {
              type: "category",
              polarIndex: 1,
              startAngle: -90,
              endAngle: -180,
              data: nombresProd
            }
          ],
          radiusAxis: [{ polarIndex: 0 }, { polarIndex: 1 }],
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
              type: "bar",// primera serie para días
              polarIndex: 0,
              data: totalesSemana,
              coordinateSystem: "polar",
              name: "Ventas por día de la semana",
              roundCap: true,
              itemStyle: { color: "#e5b3f3" }
            },
            {
              type: "bar",// segunda serie para productos
              polarIndex: 1,
              data: cantidades,
              coordinateSystem: "polar",
              name: "Top 5 productos más vendidos",
              roundCap: true,
              itemStyle: { color: "#99a66eff" }
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
   
  // Agrupa ventas totales por día de la semana
  function agruparVentasPorDiaSemana(facturas) {
    const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    const porDia = {};

    facturas.forEach(f => {
      const fecha = new Date(f.fecha);// convertir a objeto Date
      const diaNombre = dias[fecha.getDay()];// obtener nombre del día
      porDia[diaNombre] = (porDia[diaNombre] || 0) + (f.total || 0);// suma total del día
    });

    const orden = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
    return orden.map(dia => ({
      dia,
      total: porDia[dia] || 0 // si no hay ventas, 0
    }));
  }
  // Cuenta cuántas veces se vendió cada producto
  function contarProductosMasVendidos(facturas) {
    const contador = {};
    facturas.forEach(f => {
      (f.productos || []).forEach(p => { // recorrer productos de la factura
        const key = p.id; // usar ID como clave única
        if (!contador[key]) { // si no existe, inicializar
          contador[key] = { nombre: p.nombre, cantidad: 0 };// inicializar
        }
        contador[key].cantidad += p.cantidad; // sumar cantidad vendida
      });
    });
    return Object.values(contador);
  }

  return (
    <div className="polar-ventas-container">
      {/* Gráfica con 2 polares */}
      <div className="polar-grafico">
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
      </div>

      {/* Resumen debajo */}
      <div className="polar-resumen">
        {resumen ? (
          <>
            <h3>Resumen de ventas</h3>
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

export default PolarVentasDia;
