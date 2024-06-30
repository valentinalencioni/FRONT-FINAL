import { useEffect, useState } from "react";
import { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloService";

function ArticulosFaltantesTabla() {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [refreshData] = useState(false);

    useEffect(() => {
        const fetchArticulos = async () => {
            try {

                const articulos = await ArticuloService.getArticulosFaltantes();
                setArticulos(Array.isArray(articulos) ? articulos : []);
            } catch (error) {
                console.error("Error fetching articulos a reponer:", error)
            };
        }
        fetchArticulos();
    }, [refreshData]);
    console.log(JSON.stringify(articulos, null, 2));
    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Nombre</th>
                            <th className="py-2 px-4 border-b">Precio</th>
                            <th className="py-2 px-4 border-b">Stock Actual</th>
                            <th className="py-2 px-4 border-b">Stock de Seguridad</th>
                            <th className="py-2 px-4 border-b">Punto de Pedido</th>
                            <th className="py-2 px-4 border-b">Modelo de Inventario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articulos.map(articulo => (
                            <tr>
                                <td className="py-2 px-4 border-b">{articulo.id}</td>
                                <td className="py-2 px-4 border-b">{articulo.nombre}</td>
                                <td className="py-2 px-4 border-b"> {Number(articulo.precio).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 border-b">{articulo.stockActual}</td>
                                <td className="py-2 px-4 border-b">{articulo.stockSeguridad}</td>
                                <td className="py-2 px-4 border-b">{articulo.puntoPedido}</td>
                                <td className="py-2 px-4 border-b">{articulo.modeloInventario}</td>
                                
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

        </>
    )
}
export default ArticulosFaltantesTabla;