import { Articulo } from "../types/Articulo";
import { DetalleVentaDTO } from "../types/DetalleVentaDTO";
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
    },
    createVenta: async (detalleVentaDTO: DetalleVentaDTO[]): Promise <any> =>{
        const response = await fetch(`${BASE_URL}/api/v1/ventas/nuevaVenta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(detalleVentaDTO)
        });

        if (!response.ok) {
            throw new Error('Error al crear la venta');
        }

        return await response.json();        
    },

    deleteVenta: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/ventas/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ` + localStorage.getItem('token'),
            },
        });
    },    


}
