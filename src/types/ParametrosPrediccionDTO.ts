import { MetodoPrediccion } from "../enums/MetodoPrediccion";

export interface ParametrosPrediccionDTO {
  articuloId: number;
  fechaDesde: Date;
  fechaHasta: Date;
  coeficientes: Array<number>;
  mesPrediccion: number;
  anioPrediccion: number;
  alfa: number;
  cantidadPeriodosAPredecir: number;
  cantidadPeriodosAUsar: number;
  cantidadDemandaAnual: number;
  metodoPrediccion: MetodoPrediccion | null;
}
