const colors = require('colors');

import { Algoritmo, Cola } from '../../../interfaces/interfaces';
import { Proceso } from '../../Proceso';
export class FCFS implements Algoritmo {
  constructor() {}

  ejecutar(procesosCongelados, cola: Cola, tiempo: number): void {
    if (cola.length === 0) return;

    if (cola[0].isBloqueado()) return;

    cola[0].setCPU2(cola[0].getCPU2() - 1);

    console.log(`cola2  --> ${colors.green(cola.map(proceso => proceso.nombre))} --> ejecutando --> ${colors.green(cola[0].nombre)}`);

    if (cola[0].getCPU2() === 0) {
      // reconstruir los valores de los procesos
      const proceso = procesosCongelados.find(proceso => proceso.nombre === cola[0].nombre);
      cola[0].setCPU1(proceso.CPU1);
      cola[0].setES(proceso.ES);
      cola[0].setCPU2(proceso.CPU2);

      cola[0].setTiempoFinal(tiempo);
      cola[0].setFinalizado(true);
      cola.shift(); //Saca el proceso de la cola
      return;
    }
  }
}
