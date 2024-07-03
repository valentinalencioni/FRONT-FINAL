import { ModeloInventario } from "../enums/ModeloInventario";
import { Proveedor } from "./Proveedor";

export interface CrearArticuloDTO{
    nombre: string,
    
    stockActual: number,

    modeloInventario: ModeloInventario,

    tiempoRevision: number,

    idProveedorPred: Proveedor,

    tiempoDemora: number,

    costoAlmacenamiento: number,

    costoPedido: number,

    precioArticuloProveedor: number,
}