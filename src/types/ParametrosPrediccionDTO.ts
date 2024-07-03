export interface ParametrosPrediccionDTO {
    articuloId: number;
    fechaDesde: string;
    fechaHasta: string;
    coeficientes: number[];  
    mesPrediccion: number;
    anioPrediccion: number;
    alfa: number;
    cantidadPeriodosAPredecir: number;
    cantidadPeriodosAUsar: number;
    cantidadDemandaAnual: number;
    error: number;
    porcentajeDeError: number;
    prediccion: number;
  }