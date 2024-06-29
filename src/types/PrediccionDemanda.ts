import { Articulo } from "./Articulo";
import { Demanda } from "./Demanda";
import { MetodoPrediccion } from "../enums/MetodoPrediccion";

export interface PrediccionDemanda {
    id: number,
    fechaPrediccion: Date,
    valorPrediccion: number,
    demanda: Demanda,
    articulo: Articulo,
    metodoPrediccion: MetodoPrediccion,
}