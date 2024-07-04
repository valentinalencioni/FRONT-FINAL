export interface ParametrosPrediccionDTO {
  articuloId: number;
  fechaDesde: Date;
  fechaHasta: Date;
  coeficientes: number[];
  mesPrediccion: number;
  anioPrediccion: number;
  alfa: number;
  cantidadPeriodosAPredecir: number;
  cantidadPeriodosAUsar: number;
  cantidadDemandaAnual: number;
}