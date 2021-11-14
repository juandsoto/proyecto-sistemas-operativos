const RANDOM_FACTOR = 4;

export class Proceso {
  private tiempoFinal: number;
  private tiempoEspera: number;
  private tiempoServicio: number;
  private indiceServicio: number;
  private finalizado: boolean = false;

  constructor(
    public nombre: string,
    private llegada: number = Math.floor(Math.random() * RANDOM_FACTOR),
    private prioridad: number = Math.floor(Math.random() * RANDOM_FACTOR),
    private CPU1: number = Math.floor(Math.random() * RANDOM_FACTOR) + 1,
    private ES: number = Math.floor(Math.random() * RANDOM_FACTOR) + 1,
    private CPU2: number = Math.floor(Math.random() * RANDOM_FACTOR) + 1
  ) {}

  public getTiempoFinal(): number {
    return this.tiempoFinal;
  }

  public setTiempoFinal(tiempoFinal: number): void {
    this.tiempoFinal = tiempoFinal + 2;
  }

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

  public setLlegada(llegada: number): void {
    this.llegada = llegada;
  }

  public getPrioridad(): number {
    return this.prioridad;
  }

  public setPrioridad(prioridad: number): void {
    this.prioridad = prioridad;
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
}
