const colors = require('colors');

import { algoritmo } from '../../../interfaces/algoritmo';
import { Cola } from '../../../interfaces/cola';
import { Proceso } from '../../Proceso';

export class SJN implements algoritmo {
  promedioEspera: number;
  promedioServicio: number;

  constructor() {}

  penalizacion(): boolean {
    return false;
  }

  recompensa(): boolean {
    return false;
  }

  ejecutar(procesosCongelados, cola: Cola, tiempo: number): void {
    if (cola.length === 0) {
      return;
    }

    const colaOrdenada = cola.sort((a, b) => a.getCPU2() - b.getCPU2()); //se ordena la cola de menor a mayor en CPU2

    if (colaOrdenada[0].isBloqueado()) return;

    colaOrdenada[0].setCPU2(colaOrdenada[0].getCPU2() - 1);

    console.log(`cola2  --> ${colors.green(cola.map(proceso => proceso.nombre))} --> ejecutando --> ${colors.green(colaOrdenada[0].nombre)}`);

    if (colaOrdenada[0].getCPU2() === 0) {
      // reconstruir los valores de los procesos
      const proceso = procesosCongelados.find(proceso => proceso.nombre === colaOrdenada[0].nombre);
      colaOrdenada[0].setCPU1(proceso.CPU1);
      colaOrdenada[0].setES(proceso.ES);
      colaOrdenada[0].setCPU2(proceso.CPU2);

      colaOrdenada[0].setTiempoFinal(tiempo);
      colaOrdenada[0].setFinalizado(true);
      colaOrdenada.shift(); //Saca el proceso de la cola
      return;
    }
  }
}
