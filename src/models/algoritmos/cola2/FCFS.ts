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

  ejecutar(cola: Cola, colaES: Cola, tiempo: number): void {
    if (cola.length === 0) {
      return;
    }

    console.log(
      'cola2',
      cola.map((proceso) => proceso.nombre)
    );

    if (cola[0].getCPU1() > 0) {
      // estamos ejecutando la primer rafaga
      cola[0].setCPU1(cola[0].getCPU1() - 1);
    } else {
      cola[0].setCPU2(cola[0].getCPU2() - 1);

      // estamos ejecutando la segunda rafaga
    }

    // TODO: Metodo de recompensa, para subir a la cola1

    // El proceso ha finalizado su primer ráfaga
    if (cola[0].getCPU1() === 0 && cola[0].getES() !== 0) {
      //El proceso va a E/S
      colaES.push(cola.shift());
      return;
    }

    if (cola[0].getCPU2() === 0) {
      cola[0].setFinalizado(true);
      cola[0].setTiempoFinal(tiempo);
      cola.shift();
    }
  }
}
