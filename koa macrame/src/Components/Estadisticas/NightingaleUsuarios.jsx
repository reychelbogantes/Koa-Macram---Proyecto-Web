import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { GetUsers } from "../../Services/Servicios";

export default function NightingaleUsuarios() {
  const [option, setOption] = useState({});

  useEffect(() => {
    async function cargarDatos() {
      try {
        const usuarios = await GetUsers();
        const datosSemana = promedioUsuariosPorDiaSemana(usuarios);

        // ✅ asigna un valor mínimo de 0.2 a los días con promedio 0
        const datosConMinimo = datosSemana.map(d => ({
          value: d.promedio > 0 ? d.promedio : 0.2,
          name: d.dia,
          real: d.promedio
        }));

        setOption({
          title: {
            text: 'Registro de usuarios',
            subtext: 'Promedio por día de la semana',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            // mostramos el valor real, aunque internamente usemos 0.2 para radio
            formatter: (p) => `${p.name} : ${p.data.real} usuarios (${p.percent}%)`
          },
          legend: {
            left: 'center',
            top: 'bottom',
            data: datosConMinimo.map(d => d.name)
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              saveAsImage: { show: true }
            }
          },
            color: [
    "#F8BBD0", // Rosa pastel
    "#C5CAE9", // Lavanda
    "#B3E5FC", // Celeste
    "#C8E6C9", // Verde menta
    "#FFF9C4", // Amarillo suave
    "#FFE0B2", // Durazno pastel
    "#E1BEE7"  // Lila suave
  ],
          series: [
            {
              name: 'Promedio de registros',
              type: 'pie',
              radius: [20, 140],
              center: ['50%', '50%'],
              roseType: 'radius',
              itemStyle: {
                borderRadius: 5
              },
              label: {
                show: false
              },
              emphasis: {
                label: { show: true }
              },
              data: datosConMinimo
            }
          ]
        });
      } catch (err) {
        console.error("Error cargando usuarios:", err);
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
   Helper: promedio de usuarios registrados
   por día de la semana (en toda la base de datos)
--------------------------------------------------- */
function promedioUsuariosPorDiaSemana(usuarios) {
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const contador = {};
  const semanas = {};

  usuarios.forEach(u => {
    const fecha = new Date(u.fechaRegistro || u.createdAt || u.fecha || Date.now());
    const dia = dias[fecha.getDay()];
    contador[dia] = (contador[dia] || 0) + 1;

    const claveSemana = `${fecha.getFullYear()}-${getWeekNumber(fecha)}`;
    semanas[claveSemana] = true;
  });

  const totalSemanas = Object.keys(semanas).length || 1;
  const orden = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

  return orden.map(dia => ({
    dia,
    promedio: +( (contador[dia] || 0) / totalSemanas ).toFixed(2)
  }));
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date - yearStart) / 86400000) + 1)/7);
}
