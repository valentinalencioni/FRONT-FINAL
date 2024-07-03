export interface ParametrosPrediccionDTO{
    articuloId: number,
    fechaDesde: Date,
    fechaHasta: Date,

    coeficientes: number [],

    mesPrediccion: number,
    anioPrediccion: number,

    metodoPrediccion: MetodoPrediccion,

    alfa: number,

    cantidadPeriodosAPredecir: number,
    cantidadPeriodosAUsar: number,
    cantidadDemandaAnual: number,

    error: number,
    porcentajeDeError: number,
    prediccion: number,

}