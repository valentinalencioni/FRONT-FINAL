import { Articulo } from "./Articulo";
import { Proveedor } from "./Proveedor";

export interface ProveedorArticulo{
    id: number,
    tiempoDemora: number,
    costoAlmacenamiento: number,
    costoPedido: number,
    precioArticuloProveedor: number,
    articulo: Articulo,
    proveedor: Proveedor,
}