import {PrediccionDemanda} from '../types/PrediccionDemanda'
import {ParametrosPrediccionDTO} from '../types/ParametrosPrediccionDTO'

const BASE_URL ='http://localhost:8082'; 

export const PrediccionDemandaService ={
    getPrediccionesDemanda: async (): Promise <PrediccionDemanda[]> =>{
        const response = await fetch(`${BASE_URL}/api/v1/prediccionDemanda`);
        const data = await response.json();
        return data;
    },

    getPrediccionDemanda: async (articuloId: number): Promise <PrediccionDemanda> =>{
        const response = await fetch(`${BASE_URL}/api/v1/prediccionDemanda/find/${articuloId}`);
        const data = await response.json();
        return data;
    },

    createPrediccion: async (prediccion: ParametrosPrediccionDTO): Promise <any> =>{
        const response = await fetch(`${BASE_URL}/api/v1/prediccionDemanda/crear-prediccion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prediccion)
        });

        if (!response.ok) {
            throw new Error('Error al crear la prediccion');
        }

        return await response.json();
    }

    
}