import { Cola } from './cola';

export interface algoritmo {
  promedioEspera: number;
  promedioServicio: number;
  penalizacion: () => boolean;
  recompensa: () => boolean;
  ejecutar: (cola: Cola, colaES: Cola, tiempo: number) => void;
}
