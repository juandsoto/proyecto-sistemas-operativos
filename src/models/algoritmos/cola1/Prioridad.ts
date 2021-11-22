const colors = require('colors');

import { Algoritmo, Cola } from '../../../interfaces/interfaces';
import { Proceso } from '../../Proceso';
export class Prioridad implements Algoritmo {
  constructor() {}

  penalizacion(proceso: Proceso): boolean {
    return proceso.getCPU1() === 0 && proceso.getES() !== 0;
  }

  ejecutar(procesosCongelados: any, cola: Cola, tiempo: number, colaES: Cola): void {
    if (cola.length === 0) return;

    const colaOrdenada = cola.sort((a, b) => a.getLlegada() - b.getLlegada()).sort((a, b) => b.getPrioridad() - a.getPrioridad());

    colaOrdenada[0].setEnEjecucion(true);
    colaOrdenada[0].getCPU1() === 0 ? colaOrdenada[0].setCPU2(colaOrdenada[0].getCPU2() - 1) : colaOrdenada[0].setCPU1(colaOrdenada[0].getCPU1() - 1);

    // Redefenir tiempos de espera de los demas procesos
    colaOrdenada.filter(proceso => proceso.nombre !== colaOrdenada[0].nombre).forEach(proceso => proceso.setEsperaCola1(proceso.getEsperaCola1() + 1));

    console.log(`cola1  --> ${colors.green(colaOrdenada.map(proceso => proceso.nombre))} --> ejecutando --> ${colors.green(colaOrdenada[0].nombre)}`);

    // El proceso ha finalizado su primer ráfaga
    if (this.penalizacion(colaOrdenada[0])) {
      //El proceso va a E/S
      colaOrdenada[0].setEnEjecucion(false);
      colaOrdenada[0].setBloqueado(true);
      colaES.push(colaOrdenada.shift());
      return;
    }

    if (colaOrdenada[0].getCPU2() === 0) {
      // reconstruir los valores de los procesos
      const proceso = procesosCongelados.find(proceso => proceso.nombre === colaOrdenada[0].nombre);
      colaOrdenada[0].setCPU1(proceso.CPU1);
      colaOrdenada[0].setES(proceso.ES);
      colaOrdenada[0].setCPU2(proceso.CPU2);

      colaOrdenada[0].setTiempoFinal(tiempo);
      colaOrdenada[0].setEnEjecucion(false);
      colaOrdenada[0].setFinalizado(true);
      colaOrdenada.shift();
      return;
    }
  }
}
