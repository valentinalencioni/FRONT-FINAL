import { MetodoPrediccion } from "../enums/MetodoPrediccion";
import { ModeloInventario } from "./ModeloInventario";
import { Proveedor } from "./Proveedor";


export interface Articulo{
    id: number,
    nombre : string,
    precio : number,
    costoAlmacenamiento:number,
    costoPedido:number,
    stockActual:number,
    stockSeguridad:number,
    cgi:number,
    demandaAnual:number,
    modeloInventario: ModeloInventario,
    loteOptimo: number;
    puntoPedido:number;
    cantidadMaxima:number;
    cantidadAPedir:number;
    tiempoRevision:number;
    proveedorpred:Proveedor;
    metodoPred: MetodoPrediccion;
}