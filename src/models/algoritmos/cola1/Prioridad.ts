import { algoritmo } from '../../../interfaces/algoritmo';
import { Cola } from '../../../interfaces/cola';
export class Prioridad implements algoritmo {
  promedioEspera: number;
  promedioServicio: number;

  constructor() {}

  penalizacion(): boolean {
    return false;
  }
  recompensa(): boolean {
    return false;
  }
  ejecutar(cola: Cola, colaES: Cola, tiempo: number): void {
    if (cola.length === 0) {
      return;
    }

    const colaOrdenada = cola.sort((a, b) => a.getLlegada() - b.getLlegada()).sort((a, b) => b.getPrioridad() - a.getPrioridad());

    console.log(
      'cola1',
      colaOrdenada.map((proceso) => proceso.nombre)
    );

    colaOrdenada[0].setCPU1(colaOrdenada[0].getCPU1() - 1);

    // TODO: Metodo de penalizacion, para bajar a la cola2

    // El proceso ha finalizado su primer ráfaga
    if (colaOrdenada[0].getCPU1() === 0 && colaOrdenada[0].getES() !== 0) {
      //El proceso va a E/S
      colaES.push(colaOrdenada.shift());
      return;
    }

    if (cola[0].getCPU2() === 0) {
      cola[0].setFinalizado(true);
      cola[0].setTiempoFinal(tiempo);
      cola.shift();
    }
  }
}
