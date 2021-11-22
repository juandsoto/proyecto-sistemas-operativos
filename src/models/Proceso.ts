const RANDOM_LLEGADA = 4;
const RANDOM_PRIORIDAD = 3;
const RANDOM_CPU = 4;
const RANDOM_ES = 3;
export class Proceso {
  private tiempoFinal: number;
  private tiempoEspera: number;
  private tiempoServicio: number;
  private indiceServicio: number;
  private finalizado: boolean = false;
  private bloqueado: boolean = false;
  private esperaCola1: number = 0;
  private esperaCola2: number = -1;
  private enEjecucion: boolean = false;

  constructor(
    public nombre: string,
    private llegada: number = Math.floor(Math.random() * RANDOM_LLEGADA),
    private prioridad: number = Math.floor(Math.random() * RANDOM_PRIORIDAD),
    private CPU1: number = Math.floor(Math.random() * RANDOM_CPU) + 1,
    private ES: number = Math.floor(Math.random() * RANDOM_ES) + 1,
    private CPU2: number = Math.floor(Math.random() * RANDOM_CPU) + 1
  ) {}

  public getTiempoEspera(): number {
    return this.tiempoEspera;
  }

  public setTiempoEspera(tiempoEspera: number): void {
    this.tiempoEspera = tiempoEspera;
  }

  public getTiempoServicio(): number {
    return this.tiempoServicio;
  }

  public setTiempoServicio(tiempoServicio: number): void {
    this.tiempoServicio = tiempoServicio;
  }

  public getIndiceServicio(): number {
    return this.indiceServicio;
  }

  public setIndiceServicio(indiceServicio: number): void {
    this.indiceServicio = indiceServicio;
  }

  public getLlegada(): number {
    return this.llegada;
  }

  public getPrioridad(): number {
    return this.prioridad;
  }

  public getCPU1(): number {
    return this.CPU1;
  }

  public setCPU1(CPU1: number): void {
    this.CPU1 = CPU1;
  }

  public getES(): number {
    return this.ES;
  }

  public setES(ES: number): void {
    this.ES = ES;
  }

  public getCPU2(): number {
    return this.CPU2;
  }

  public setCPU2(CPU2: number): void {
    this.CPU2 = CPU2;
  }

  public isFinalizado(): boolean {
    return this.finalizado;
  }

  public setFinalizado(finalizado: boolean): void {
    this.finalizado = finalizado;
  }

  public isBloqueado(): boolean {
    return this.bloqueado;
  }

  public setBloqueado(bloqueado: boolean): void {
    this.bloqueado = bloqueado;
  }

  public getEsperaCola2(): number {
    return this.esperaCola2;
  }

  public setEsperaCola2(esperaCola2: number): void {
    this.esperaCola2 = esperaCola2;
  }

  public isEnEjecucion(): boolean {
    return this.enEjecucion;
  }

  public setEnEjecucion(enEjecucion: boolean): void {
    this.enEjecucion = enEjecucion;
  }

  public getTiempoFinal(): number {
    return this.tiempoFinal;
  }

  public setTiempoFinal(tiempoFinal: number): void {
    this.tiempoFinal = tiempoFinal + 1;
    this.tiempoServicio = this.tiempoFinal - this.llegada;
    this.tiempoEspera = this.tiempoServicio - this.CPU1 - this.CPU2;
    this.indiceServicio = Number(((this.CPU1 + this.CPU2) / this.tiempoServicio).toFixed(2));
  }

  public getEsperaCola1(): number {
    return this.esperaCola1;
  }

  public setEsperaCola1(esperaCola1: number): void {
    this.esperaCola1 = esperaCola1;
  }
}
