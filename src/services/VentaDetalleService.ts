import { VentaDetalle } from "../types/VentaDetalle";

const BASE_URL = 'http://localhost:8082';
export const VentaDetalleService = {
    getVentaDetalle: async (id: number): 
    Promise<VentaDetalle[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/ventasdetalles/detallesventa/${id}`);
        const data = response.json();
        return data;
    },

}
