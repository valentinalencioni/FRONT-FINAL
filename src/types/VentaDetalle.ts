import { Articulo } from "./Articulo";
import { Venta } from "./Venta";

export interface VentaDetalle {
    id: number,
    cantidadVenta: number,
    subtotal: number,
    articulo: Articulo,
    idVenta: Venta,
}