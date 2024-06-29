import { Articulo } from "./Articulo";

export interface Demanda {
    id: number,
    fechaDesde: Date,
    fechaHasta: Date,
    totalDemanda: number,
    articulo: Articulo,
}