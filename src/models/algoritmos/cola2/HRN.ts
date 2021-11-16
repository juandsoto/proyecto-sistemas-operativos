const colors = require('colors');

import { algoritmo } from '../../../interfaces/algoritmo';
import { Cola } from '../../../interfaces/cola';

export class FCFS implements algoritmo {
  promedioEspera: number;
  promedioServicio: number;

  constructor() {}

  //Degradar el proceso a la cola #2
  penalizacion(): boolean {
    return false;
  }

  //Subir el proceso a la cola #1
  recompensa(): boolean {
    return false;
  }

  ejecutar(cola: Cola, colaES: Cola, tiempo: number): void {}
}
