import { Proveedor } from "../types/Proveedor";

const BASE_URL = 'http://localhost:8082'; 


export const ProveedorService ={
    getProveedores:async (): Promise<Proveedor[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/proveedor`); //nos dirige a un articulo en particular dependiendo el id que se ingrese
        const data= await response.json();
        return data;
    },
}
    