import { DetalleOrdenCompra } from "../types/DetalleOrdenCompra";

const BASE_URL = 'http://localhost:8082';
export const DetalleOCService = {
    getDetallesOC: async (id: number): Promise<DetalleOrdenCompra[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/detallesOrdenCompra/detallesOC/${id}`);
        const data = response.json();
        return data;
    },
}

