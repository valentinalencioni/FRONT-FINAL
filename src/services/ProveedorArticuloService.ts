import { Articulo } from "../types/Articulo";
import { crearPADTO } from "../types/CrearPADTO";
import { ProveedorArticulo } from "../types/ProveedorArticulo";

const BASE_URL ='http://localhost:8082';

export const ProveedorArticuloService={
    

    getProveedoresArt: async (): Promise<ProveedorArticulo[]> =>{
        const response = await fetch(`${BASE_URL}/api/v1/proveedorarticulo`);
        const data = await response.json();
        return data;
    },

    createProveedorArt: async (provart: crearPADTO): Promise <any> =>{
        const response = await fetch(`${BASE_URL}/api/v1/proveedorarticulo/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(provart),
        });
        if (!response.ok) {
            throw new Error('Error al crear Proveedor Articulo');
        }

        return await response.json();
    }
    


}