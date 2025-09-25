import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getOrdenes } from "../../Services/Servicios";

export default function HalfDoughnutOrdenes() {
  const [option, setOption] = useState({});

  useEffect(() => {
    async function cargarDatos() {
      try {
        const ordenes = await getOrdenes();
        const resumen = contarOrdenesPorEstadoMes(ordenes);

        setOption({
            series: [
            {
              name: 'Órdenes del mes',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '70%'],
              startAngle: 180,
              endAngle: 360,
              data: [
                { value: resumen.pendiente, name: 'Pendientes' },
                { value: resumen.enviada,   name: 'Enviadas' },
                { value: resumen.cancelada, name: 'Canceladas' }
              ],
              itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                position: 'outside'
              }
            }
          ],
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            top: '5%',
            left: 'center'
          }, toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              saveAsImage: { show: true }
            }
          },
          color: [
    "#F8BBD0", // Rosa pastel
    "#C5CAE9", // Lavanda
    "#C8E6C9", // Verde menta
    "#B3E5FC", // Celeste
    "#FFF9C4", // Amarillo suave
    "#FFE0B2", // Durazno pastel
    "#E1BEE7"  // Lila suave
  ],

        });
      } catch (err) {
        console.error("Error cargando las órdenes:", err);
      }
    }
    cargarDatos();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

/* ---------------------------------------------------
   Helper: cuenta cuántas órdenes del MES ACTUAL hay
   en cada estado (pendiente, enviada, cancelada)
--------------------------------------------------- */
function contarOrdenesPorEstadoMes(ordenes) {
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  const resumen = { pendiente: 0, enviada: 0, cancelada: 0 };

  ordenes.forEach(o => {
    const fecha = new Date(o.fecha);      // Ajusta si tu campo de fecha se llama distinto
    if (fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual) {
      const estado = (o.estado || "").toLowerCase();
      if (estado.includes("pend")) resumen.pendiente++;
      else if (estado.includes("env")) resumen.enviada++;
      else if (estado.includes("cancel")) resumen.cancelada++;
    }
  });

  return resumen;
}
