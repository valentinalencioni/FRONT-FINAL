import { Articulo } from "./Articulo";
import { OrdenCompra } from "./OrdenCompra";

export interface DetalleOrdenCompra {
    id: number,
    cantidadOCD: number,
    articulo: Articulo,
    subtotal: number,
    idOrdenCompra: OrdenCompra,
}