const fs = require('fs');
import * as chartjs from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';
import { ChartCallback } from 'chartjs-node-canvas';

import { Proceso } from '../models/Proceso';
import { Cola } from '../interfaces/interfaces';

const TRANSPARENT: string = 'rgba(255,255,255,1)';
const GREEN: string = 'rgba(106, 176, 76,1.0)';
const YELLOW: string = 'rgba(249, 202, 36,1.0)';
const BLUE: string = 'rgba(34, 166, 179,1.0)';
const DARK_GREEN: string = 'rgba(76, 146, 46,1.0)';
const DARK_YELLOW: string = 'rgba(219, 172, 6,1.0)';

let data = [];

const ordenar = (procesos: Proceso[]): Proceso[] => {
  return procesos
    .map(proceso => proceso)
    .sort((a, b) => {
      const aNumber = Number(a.nombre.substr(7, 1));
      const bNumber = Number(b.nombre.substr(7, 1));

      return bNumber - aNumber;
    });
};

export const dataset = (tiempo: number, cola1: Cola, colaES: Cola, cola2: Cola, procesos: Proceso[]) => {
  const procesosOrdenados = ordenar(procesos);

  data.push({
    data: procesosOrdenados.map(_ => 1),
    backgroundColor: procesosOrdenados.map(proceso => {
      if (tiempo < proceso.getLlegada() || proceso.isFinalizado()) {
        return TRANSPARENT;
      }
      if (cola1.length) {
        if (cola1[0].nombre === proceso.nombre) {
          return YELLOW;
        }
      }
      if (colaES.find(p => p.nombre === proceso.nombre)) {
        return BLUE;
      }
      if (cola2.length && cola1.length === 0) {
        if (cola2[0].nombre === proceso.nombre) {
          return DARK_YELLOW;
        }
      }

      return GREEN;
    })
  });
};

export const chart = async (procesos: Proceso[]) => {
  const width = 1200;
  const height = 500;

  const procesosOrdenados: Proceso[] = ordenar(procesos);

  const configuration: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: procesosOrdenados.map(proceso => proceso.nombre),
      datasets: data
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            stepSize: 1
          }
        },
        y: {
          stacked: true
        }
      }
    },
    plugins: [
      {
        id: 'background-colour',
        beforeDraw: chart => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }
      }
    ]
  };

  const chartCallback: ChartCallback = ChartJS => {
    ChartJS.defaults.responsive = true;
    ChartJS.defaults.maintainAspectRatio = false;
  };
  const chartJSNodeCanvas = new chartjs.ChartJSNodeCanvas({ type: 'svg', width, height, chartCallback });
  const buffer = await chartJSNodeCanvas.renderToBufferSync(configuration);

  fs.writeFileSync('./procesos.svg', buffer);
  console.log('SVG generado correctamente');
};
