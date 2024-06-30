import {OrdenCompra} from './types/OrdenCompra'
const BASE_URL = 'http://localhost:8082'; 

export const OrdenCompraService = {
    getOrdenesCompra: async (): Promise<OrdenCompra[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/ordenCompra`);
        const data = await response.json();
        return data;
    },

    getOrdenCompra: async (id: number): Promise<OrdenCompra> => {
        const response = await fetch(`${BASE_URL}/api/v1/ordenCompra/${id}`);
        const data = await response.json();
        return data;
    },

    createOrdenCompra: async (ordenCompra: OrdenCompra): Promise<OrdenCompra> => {
        const response = await fetch(`${BASE_URL}/api/v1/ordenCompra`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ordenCompra)
        });
        const data = await response.json();
        return data;
    },

    updateOrdenCompra: async (ordenCompra: OrdenCompra): Promise<OrdenCompra> => {
        const response = await fetch(`${BASE_URL}/api/v1/ordenCompra/${ordenCompra.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ordenCompra)
        });
        const data = await response.json();
        return data;
    },

    deleteOrdenCompra: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/ordenCompra/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ` + localStorage.getItem('token'),
            },
        });
    },
    filterOrdenesByEstado: async (estado: string): Promise<OrdenCompra[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/ordenCompra/findOrdenesByEstado?filtroEstado=${estado}`);
        const data = await response.json();
        return data;
    }
}