const colors = require('colors');

import { getInput, getInfo } from './utils/questions';
import { Proceso } from './models/Proceso';
import { Info, Input } from './interfaces/input';
import { Cola } from './interfaces/cola';
import { FCFS } from './models/algoritmos/cola2/FCFS';
import { Prioridad } from './models/algoritmos/cola1/Prioridad';
import { SJN } from './models/algoritmos/cola2/SJN';

let cola1: Cola = [];
let cola2: Cola = [];
let colaES: Cola = [];
let procesos: Proceso[] = [];
let proceso: Proceso;
let tiempo: number = 0;
let procesosCongelados;
let procesoIndex: number = 1;

async function main() {
  console.clear();

  const input: Input = await getInput();

  // procesos.push(new Proceso('procesoA', 3, 2, 1, 3, 2));
  // procesos.push(new Proceso('procesoB', 0, 0, 3, 3, 3));
  // procesos.push(new Proceso('procesoC', 2, 1, 4, 4, 1));
  // procesos.push(new Proceso('procesoD', 1, 3, 1, 4, 4));
  // procesos.push(new Proceso('procesoE', 0, 2, 3, 2, 4));
  do {
    if (input.eleccion === 1) {
      proceso = new Proceso(`Proceso${procesoIndex}`);
    } else {
      console.log(colors.green(`Información del Proceso${procesoIndex}`));
      const { llegada, prioridad, CPU1, ES, CPU2 } = await getInfo();
      proceso = new Proceso(`Proceso${procesoIndex}`, llegada, prioridad, CPU1, ES, CPU2);
    }
    procesos.push(proceso);
    procesoIndex++;
    input.numeroDeProcesos--;
  } while (input.numeroDeProcesos !== 0);

  // Saco los valores originales de cada proceso, ya que estos cambiaran durante la ejecucion del programa y no los queremos perder
  procesosCongelados = procesos.map(proceso => ({ nombre: proceso.nombre, CPU1: proceso.getCPU1(), ES: proceso.getES(), CPU2: proceso.getCPU2() }));

  const algoritmoCola1 = new Prioridad();
  let algoritmoCola2;
  switch (input.algoritmo) {
    case 'fcfs':
      algoritmoCola2 = new FCFS();
      break;
    case 'sjn':
      algoritmoCola2 = new SJN();
    case 'hrn':
      // algoritmoCola2 = new SJN();
      break;
    default:
      algoritmoCola2 = new FCFS();
      break;
  }

  do {
    const procesosEnEjecucion = procesos.filter(proceso => proceso.getLlegada() === tiempo && !proceso.isFinalizado());
    procesosEnEjecucion.forEach(proceso => cola1.push(proceso));

    console.log(colors.white.bold('------>tiempo '), tiempo);

    ejecutarES(colaES);
    if (cola1.length > 0) {
      algoritmoCola1.ejecutar(procesosCongelados, cola1, tiempo, colaES);
      if (cola2.length > 0) {
        console.log(`cola2  --> ${colors.green(cola2.map(proceso => proceso.nombre))} --> ${colors.bgRed('EN ESPERA')}`);
      }
    } else {
      algoritmoCola2.ejecutar(procesosCongelados, cola2, tiempo);
    }

    colaES.forEach(proceso => {
      if (proceso.getES() === 0) {
        proceso.setBloqueado(false);
      }
    });

    const terminados = colaES.filter(proceso => proceso.getES() === 0);
    terminados.forEach(proceso => colaES.splice(colaES.indexOf(proceso), 1));

    tiempo++;
  } while (!procesos.every(proceso => proceso.isFinalizado()));

  imprimirTabulacion();
}

const ejecutarES = (cola: Cola): void => {
  if (cola.length !== 0) {
    console.log(`colaES --> ${colors.green(cola.map(proceso => proceso.nombre))}`);
  }
  cola.forEach(proceso => {
    proceso.setES(proceso.getES() - 1);
    if (proceso.getES() === 0) {
      cola2.push(proceso);
    }
  });
};

const imprimirTabulacion = () => {
  console.log(
    colors.green(
      '======================================================================== TABULACIÓN ========================================================================'
    )
  );
  console.table(
    procesos.map((proceso: Proceso, index) => ({
      'PROCESO': proceso.nombre,
      'Instante de llegada': proceso.getLlegada(),
      'Prioridad': proceso.getPrioridad(),
      'Ráfaga de CPU1': proceso.getCPU1(),
      'Ráfaga de E/S': proceso.getES(),
      'Ráfaga de CPU2': proceso.getCPU2(),
      'Tf': proceso.getTiempoFinal(),
      'T(mínimo)': proceso.getTiempoServicio(),
      'E(mínimo)': proceso.getTiempoEspera(),
      'I(máximo)': proceso.getIndiceServicio()
    }))
  );
  console.log(colors.green('========= PROMEDIOS ========='));
  const numbers = procesos
    .map(proceso => ({ T: proceso.getTiempoServicio(), E: proceso.getTiempoEspera(), I: proceso.getIndiceServicio() }))
    .reduce((acc, current) => {
      const T = acc.T + current.T;
      const E = acc.E + current.E;
      const I = acc.I + current.I;
      return { T, E, I };
    });
  console.table([
    {
      'T(mínimo)': Number((numbers.T / procesos.length).toFixed(2)),
      'E(mínimo)': Number((numbers.E / procesos.length).toFixed(2)),
      'I(máximo)': Number((numbers.I / procesos.length).toFixed(2))
    }
  ]);
};

main();
