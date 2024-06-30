import {Venta} from "../types/Venta";

const BASE_URL ='http://localhost:8082'; 

export const VentaService = {
    //Devolver ventas
    getVentas:async (): Promise<Venta[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/ventas`);
        const data= response.json();
        return data;
    },


    //Agregar metodo para filtrar por fechas (secundario a revisar, desde y hasta tendrian que ser tipo Date)
    findVentasByFechas: async (desde: string, hasta: string): Promise<Venta[]> => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/ventas/findVentasByFechas?desde=${desde}&hasta=${hasta}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching ventas by fechas:', error);
            throw error;
        }
    }
    


}
