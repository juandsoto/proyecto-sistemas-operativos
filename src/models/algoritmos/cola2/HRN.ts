const colors = require('colors');

import { Algoritmo, Cola } from '../../../interfaces/interfaces';
import { Proceso } from '../../Proceso';

export class HRN implements Algoritmo {
  constructor() {}

  ejecutar(procesosCongelados, cola: Cola, tiempo: number): void {
    if (cola.length === 0) {
      return;
    }
    if (cola[0].isBloqueado()) return;

    let colaOrdenada: Proceso[] = cola;

    if (!colaOrdenada[0].isEnEjecucion()) {
      colaOrdenada = cola.sort((a, b) => {
        const aCongelado = procesosCongelados.find(pro => pro.nombre === a.nombre);
        const bCongelado = procesosCongelados.find(pro => pro.nombre === b.nombre);
        const aFormula = this.formula(a.getEsperaCola2(), aCongelado.CPU2);
        const bFormula = this.formula(b.getEsperaCola2(), bCongelado.CPU2);

        return aFormula - bFormula;
      });
    }

    colaOrdenada[0].setEnEjecucion(true);
    colaOrdenada[0].setCPU2(colaOrdenada[0].getCPU2() - 1);

    // Redefenir tiempos de espera de los demas procesos
    colaOrdenada.filter(proceso => proceso !== colaOrdenada[0]).forEach(proceso => proceso.setEsperaCola2(proceso.getEsperaCola2() + 1));

    console.log(`cola2  --> ${colors.green(colaOrdenada.map(proceso => proceso.nombre))} --> ejecutando --> ${colors.green(colaOrdenada[0].nombre)}`);

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
  //
  private formula(W: number, t: number): number {
    return ((W === -1 ? 0 : W) + t) / t;
  }
}
