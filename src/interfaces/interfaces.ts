import { Proceso } from '../models/Proceso';

export type Cola = Proceso[];
export interface Algoritmo {
  penalizacion?: (proceso: Proceso) => boolean;
  recompensa?: (cola: Cola) => boolean;
  ejecutar: (procesosCongelados: any, cola: Cola, tiempo: number, colaAux: Cola) => void;
}
export interface Input {
  eleccion: number;
  numeroDeProcesos: number;
  algoritmo: string;
}
export interface Info {
  prioridad: number;
  CPU1: number;
  ES: number;
  CPU2: number;
  llegada: number;
}
