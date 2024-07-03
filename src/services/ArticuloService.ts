import { Articulo } from "../types/Articulo";
import { CrearArticuloDTO } from "../types/CrearArticuloDTO";
import { FaltanteDTO } from "../types/FaltanteDTO";
import { ReponerDTO } from "../types/ReponerDTO";


const BASE_URL ='http://localhost:8082'; 

export const ArticuloService = {
    // Me devuelve un array con todos los articulos
    getArticulos:async (): Promise<Articulo[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/articulos`);
        const data= response.json();
        return data;
    },

    getArticulo:async (id:number): Promise<Articulo> => {
        const response = await fetch(`${BASE_URL}/api/v1/articulos/${id}`); //nos dirige a un articulo en particular dependiendo el id que se ingrese
        const data= await response.json();
        return data;
    },
    
    createArticulo: async (articuloDto: CrearArticuloDTO): Promise<any> => {
        const response = await fetch(`${BASE_URL}/api/v1/articulos/crear`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articuloDto)
        });
        if (!response.ok) {
            throw new Error('Error al crear Articulo');
        }
        return await response.json();
    },

    updateArticulo: async (art: Articulo): Promise<Articulo> => {
        const response = await fetch(`${BASE_URL}/api/v1/articulos/${art.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(art) 
        });
        if (!response.ok) {
            throw new Error('Failed to update articulo');
        }
        const data = await response.json();
        return data;
    },

    deleteArticulo: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/articulos/baja/${id}`, {
            method: 'DELETE', 
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ` + localStorage.getItem('token'),
            },
        });
    },

    calcularTodo: async (id: number): Promise<Articulo> => {
        const response = await fetch(`${BASE_URL}/api/v1/articulos/calculos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to calculate articulo values');
        }
        const data = await response.json();
        return data;
    },
    
    getArticulosAReponer: async() : Promise <ReponerDTO []> =>{
        const response = await fetch (`${BASE_URL}/api/v1/articulos/reponer`);
        const data= await response.json();
        return data;

    },

    getArticulosFaltantes: async() : Promise <FaltanteDTO []> =>{
        const response = await fetch (`${BASE_URL}/api/v1/articulos/faltantes`);
        const data= await response.json();
        return data;

    },
    modeloArticulo: async (id: number): Promise<void> => {

        const response = await fetch(`${BASE_URL}/api/v1/articulos/modelo-inventario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al cambiar modelo');
        }
        const data = await response.json();
        return data;
    },

    cambiarProveedor: async (proveedorId: number, articuloId: number): Promise<void> =>{

        const response = await fetch(`${BASE_URL}/api/v1/articulos/valores-proveedor/${proveedorId}/${articuloId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al cambiar proveedor');
        }
        const data = await response.json();
        return data;
    },


}