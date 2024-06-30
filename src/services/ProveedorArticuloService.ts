import { Articulo } from "../types/Articulo";
import { ProveedorArticulo } from "../types/ProveedorArticulo";

const BASE_URL ='http://localhost:8082';

export const ProveedorArticuloService={
    createProvArt: async (articulo: Articulo): Promise<ProveedorArticulo> => {
        const response = await fetch(`${BASE_URL}/api/v1/proveedorarticulo`, {
            method: "POST",
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ` + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articulo)
        });
        const data= await response.json();
        return data;
    },

    getProvArt: async (id: number): Promise <ProveedorArticulo[]>=>{
        const response= await fetch(`${BASE_URL}/api/v1/proveedorarticulo/findProveedoresByArticulo/${id}`,{
            method: "GET", 
            headers:{
                'Accept': '*/*',
                'Authorization': `Bearer ` + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        const data=await response.json();
        return data;
    },
    


}