const colors = require('colors');

import { getInput, getInfo } from './utils/input';

import { Input, Cola } from './interfaces/interfaces';

import { Proceso } from './models/Proceso';
import { Prioridad } from './models/algoritmos/cola1/Prioridad';
import { FCFS } from './models/algoritmos/cola2/FCFS';
import { SJN } from './models/algoritmos/cola2/SJN';
import { HRN } from './models/algoritmos/cola2/HRN';

let cola1: Cola = [];
let colaES: Cola = [];
let cola2: Cola = [];
let procesosCongelados;
let procesos: Proceso[] = [];
let proceso: Proceso;
let tiempo: number = 0;

async function main() {
  const input: Input = await getInput();
  // Inicializacion de procesos con los datos ingresados por el usuario
  await inicializarProcesos(input.eleccion, input.numeroDeProcesos);
  // Saco los valores originales de cada proceso, ya que estos cambiaran durante la ejecucion del programa y no los queremos perder
  procesosCongelados = procesos.map(proceso => ({ nombre: proceso.nombre, CPU1: proceso.getCPU1(), ES: proceso.getES(), CPU2: proceso.getCPU2() }));
  // Decidimos que algoritmos usar
  const [algoritmoCola1, algoritmoCola2] = inicializarAlgoritmos(input.algoritmo);

  do {
    // Filtrar los procesos que han llegado a la cola1 para trabajar con ellos
    procesos.filter(proceso => proceso.getLlegada() === tiempo && !proceso.isFinalizado()).forEach(proceso => cola1.push(proceso));
    console.log(colors.white.bold('------>tiempo '), tiempo);

    // Ejecutamos la rafaga de E/S
    ejecutarES(colaES);

    if (cola1.length) {
      // Ejecucion de la cola1
      algoritmoCola1.ejecutar(procesosCongelados, cola1, tiempo, colaES);
      if (cola2.length) {
        // Aumentamos el tiempo de espera de los procesos de la cola2 porque aún hay procesos en la cola1
        cola2.forEach(proceso => proceso.setEsperaCola2(proceso.getEsperaCola2() + 1));
        console.log(`cola2  --> ${colors.green(cola2.map(proceso => proceso.nombre))} --> ${colors.bgRed('EN ESPERA')}`);
      }
    } else {
      // Ejecucion de la cola2
      algoritmoCola2.ejecutar(procesosCongelados, cola2, tiempo);
    }

    // Desbloquear los procesos que han terminado su rafaga de E/S
    colaES.forEach(proceso => proceso.getES() === 0 && proceso.setBloqueado(false));
    // Sacar los procesos que han terminado su rafaga de E/S de la cola de E/S
    colaES.filter(proceso => proceso.getES() === 0).forEach(proceso => colaES.splice(colaES.indexOf(proceso), 1));
    tiempo++;
  } while (!procesos.every(proceso => proceso.isFinalizado()));

  imprimirTabulacion();
}

const inicializarProcesos = async (eleccion: number, numeroDeProcesos: number) => {
  let procesoIndex: number = 1;
  do {
    if (eleccion === 1) {
      proceso = new Proceso(`Proceso${procesoIndex}`);
    } else {
      console.log(colors.green(`Información del Proceso${procesoIndex}`));
      const { llegada, prioridad, CPU1, ES, CPU2 } = await getInfo();
      proceso = new Proceso(`Proceso${procesoIndex}`, llegada, prioridad, CPU1, ES, CPU2);
    }
    procesos.push(proceso);
    procesoIndex++;
    numeroDeProcesos--;
  } while (numeroDeProcesos !== 0);
};

const inicializarAlgoritmos = (algoritmo: string): [Prioridad, FCFS | SJN | HRN] => {
  switch (algoritmo) {
    case 'fcfs':
      return [new Prioridad(), new FCFS()];
    case 'sjn':
      return [new Prioridad(), new SJN()];
    case 'hrn':
      return [new Prioridad(), new HRN()];
    default:
      return [new Prioridad(), new FCFS()];
  }
};

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
      'I(máximo)': proceso.getIndiceServicio(),
      'F': proceso.isFinalizado()
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
