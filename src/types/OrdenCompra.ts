import { EstadoOrdenCompra } from "../enums/EstadoOrdenCompra";
import { Proveedor } from "./Proveedor";

export interface OrdenCompra{
    id:number,
    fechaOrdenCompra:Date,
    totalOrdenCompra:number,
    estadoOrdenCompra: EstadoOrdenCompra,
    proveedor: Proveedor,
}