import { ModeloInventario } from "../enums/ModeloInventario";
export interface CrearArticuloDTO{
    nombre: string,
    stockActual: number,
    modeloInventario: ModeloInventario,
    tiempoRevision: number,
    idProveedorPred: number,
    tiempoDemora: number,
    costoAlmacenamiento: number,
    costoPedido: number,
    precioArticuloProveedor: number,
}