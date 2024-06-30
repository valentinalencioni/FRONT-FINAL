import { Articulo } from "../types/Articulo";

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
    
    createArticulo: async (articulo: Articulo): Promise<Articulo> => {
        const response = await fetch(`${BASE_URL}/api/v1/articulos`, {
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
    
    getArticulosAReponer: async() : Promise <Articulo []> =>{
        const response = await fetch (`${BASE_URL}/api/v1/articulos/reponer`);
        const data= await response.json();
        return data;

    },

    getArticulosFaltantes: async() : Promise <Articulo []> =>{
        const response = await fetch (`${BASE_URL}/api/v1/articulos/faltantes`);
        const data= await response.json();
        return data;

    },

}