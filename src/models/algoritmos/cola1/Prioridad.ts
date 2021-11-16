const colors = require('colors');

import { algoritmo } from '../../../interfaces/algoritmo';
import { Cola } from '../../../interfaces/cola';
import { Proceso } from '../../Proceso';
export class Prioridad implements algoritmo {
  promedioEspera: number;
  promedioServicio: number;

  constructor() {}

  penalizacion(cola: Cola): boolean {
    return cola[0].getCPU1() === 0 && cola[0].getES() !== 0;
  }
  recompensa(): boolean {
    return false;
  }
  ejecutar(_: Proceso[], cola: Cola, __: number, colaES: Cola): void {
    if (cola.length === 0) {
      return;
    }

    const colaOrdenada = cola.sort((a, b) => a.getLlegada() - b.getLlegada()).sort((a, b) => b.getPrioridad() - a.getPrioridad());

    colaOrdenada[0].setCPU1(colaOrdenada[0].getCPU1() - 1);

    console.log(`cola1  --> ${colors.green(colaOrdenada.map(proceso => proceso.nombre))} --> ejecutando --> ${colors.green(colaOrdenada[0].nombre)}`);

    // El proceso ha finalizado su primer ráfaga
    if (this.penalizacion(colaOrdenada)) {
      //El proceso va a E/S
      colaOrdenada[0].setBloqueado(true);
      colaES.push(colaOrdenada.shift());
      return;
    }
  }
}
