const colors = require('colors');

import { getInput, getInfo } from './utils/questions';
import { Proceso } from './models/Proceso';
import { Info, Input } from './interfaces/input';
import { Cola } from './interfaces/cola';
import { FCFS } from './models/algoritmos/cola2/FCFS';
import { Prioridad } from './models/algoritmos/cola1/Prioridad';

let cola1: Cola = [];
let cola2: Cola = [];
let colaES: Cola = [];
let procesos: Proceso[] = [];
let proceso: Proceso;
let tiempo: number = 0;

// TODO: ARREGLAR LOS TIEMPOS

async function main() {
  console.clear();

  const input: Input = await getInput();

  procesos.push(new Proceso('procesoA', 3, 2, 1, 3, 2));
  procesos.push(new Proceso('procesoB', 0, 0, 3, 3, 3));
  procesos.push(new Proceso('procesoC', 2, 1, 4, 4, 1));
  procesos.push(new Proceso('procesoD', 1, 3, 1, 4, 4));
  procesos.push(new Proceso('procesoE', 0, 2, 3, 2, 4));
  // do {
  //   if (input.eleccion === 1) {
  //     proceso = new Proceso();
  //   } else {
  //     const { llegada, prioridad, CPU1, ES, CPU2 } = await getInfo();
  //     proceso = new Proceso(llegada, prioridad, CPU1, ES, CPU2);
  //   }
  //   procesos.push(proceso);
  //   input.numeroDeProcesos--;
  // } while (input.numeroDeProcesos !== 0);

  imprimirTabulacion();

  const prioridad = new Prioridad();
  const fcfs = new FCFS();

  do {
    const procesosEnEjecucion = procesos.filter((proceso) => proceso.getLlegada() === tiempo && !proceso.isFinalizado());
    procesosEnEjecucion.forEach((proceso) => cola1.push(proceso));

    console.log('------>tiempo', tiempo);
    ejecutarES(colaES);
    prioridad.ejecutar(cola1, colaES, tiempo);
    if (cola1.length === 0) {
      fcfs.ejecutar(cola2, colaES, tiempo);
    }

    tiempo++;
  } while (tiempo < 30);

  // Degradacion del proceso actual de la cola1 a la cola2
  // cola2.push(cola1.shift());

  // fcfs.ejecutar();
  // console.log(fcfs.getColas);

  imprimirTabulacion();
}

const ejecutarES = (cola: Cola): void => {
  if (cola.length !== 0) {
    console.log(
      'colaES',
      cola.map((proceso) => {
        return {
          nombre: proceso.nombre,
          ES: proceso.getES(),
        };
      })
    );
  }

  cola.forEach((proceso) => {
    proceso.setES(proceso.getES() - 1);
    if (proceso.getES() === 0) {
      //Remover el proceso de la colaES y meterlo a la cola2
      cola2.push(proceso);
      cola.splice(cola.indexOf(proceso), 1);
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
      'Finalizado': proceso.isFinalizado(),
      // 'T(mínimo)': proceso.getTiempoServicio(),
      // 'E(mínimo)': proceso.getTiempoEspera(),
      // 'I(máximo)': proceso.getIndiceServicio(),
    }))
  );
};

main();
