import { Cola } from './cola';

export interface algoritmo {
  promedioEspera: number;
  promedioServicio: number;
  penalizacion: (cola: Cola) => boolean;
  recompensa: () => boolean;
  ejecutar: (procesosCongelados: any, cola: Cola, tiempo: number, colaES?: Cola) => void;
}
