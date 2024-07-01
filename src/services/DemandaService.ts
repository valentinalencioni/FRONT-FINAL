import { Demanda } from "../types/Demanda";
import { DemandaDTO } from "../types/DemandaDTO";

const BASE_URL ='http://localhost:8082'; 

export const DemandaService ={
    getDemandas: async (): Promise<Demanda[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/demanda`);
        const data = await response.json();
        return data;
    },

    calculateDemanda: async (demanda: DemandaDTO): Promise<any> => {
        const response = await fetch(`${BASE_URL}/api/v1/demanda/calcularDemanda`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(demanda)
        });
        const data = await response.json();
        return data;
    }
}
