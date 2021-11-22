const colors = require('colors');

import { Algoritmo, Cola } from '../../../interfaces/interfaces';
import { Proceso } from '../../Proceso';

export class SJN implements Algoritmo {
  constructor() {}

  //Se envian los procesos que tienen mas de ciertas unidades de rafaga de cpu2 a la cola de mayor prioridad
  recompensa(cola: Cola): boolean {
    return cola.some(proceso => proceso.getCPU2() > 2);
  }

  type() {
    return 'SJN';
  }

  ejecutar(procesosCongelados, cola: Cola, tiempo: number, colaDeMayorPrioridad: Cola): void {
    if (cola.length === 0) {
      return;
    }

    if (cola[0].isBloqueado()) return;

    if (this.recompensa(cola)) {
      const filtro = cola.filter(proceso => proceso.getCPU2() > 2);
      console.log(colors.bgRed(`${filtro.map(proceso => proceso.nombre)} enviado/s a la cola de mayor prioridad`));

      filtro.forEach(proceso => {
        colaDeMayorPrioridad.push(proceso);
        cola.splice(
          cola.findIndex(p => p.nombre === proceso.nombre),
          1
        );
      });

      return;
    }

    const colaOrdenada = cola.sort((a, b) => a.getCPU2() - b.getCPU2()); //se ordena la cola de menor a mayor en CPU2

    if (colaOrdenada[0].isBloqueado()) return;

    colaOrdenada[0].setEnEjecucion(true);
    colaOrdenada[0].setCPU2(colaOrdenada[0].getCPU2() - 1);

    // Redefenir tiempos de espera de los demas procesos
    colaOrdenada.filter(proceso => proceso.nombre !== colaOrdenada[0].nombre).forEach(proceso => proceso.setEsperaCola2(proceso.getEsperaCola2() + 1));

    console.log(`cola2  --> ${colors.green(cola.map(proceso => proceso.nombre))} --> ejecutando --> ${colors.green(colaOrdenada[0].nombre)}`);

    if (colaOrdenada[0].getCPU2() === 0) {
      // reconstruir los valores de los procesos
      const proceso = procesosCongelados.find(proceso => proceso.nombre === colaOrdenada[0].nombre);
      colaOrdenada[0].setCPU1(proceso.CPU1);
      colaOrdenada[0].setES(proceso.ES);
      colaOrdenada[0].setCPU2(proceso.CPU2);

      colaOrdenada[0].setTiempoFinal(tiempo);
      colaOrdenada[0].setEnEjecucion(false);
      colaOrdenada[0].setFinalizado(true);
      colaOrdenada.shift(); //Saca el proceso de la cola
      return;
    }
  }
}
