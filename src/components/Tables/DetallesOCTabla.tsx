import { useNavigate, useParams } from "react-router-dom";
import { OrdenCompra } from "../../types/OrdenCompra";
import { useEffect, useState } from "react";
import { DetalleOrdenCompra } from "../../types/DetalleOrdenCompra";
import { DetalleOCService } from "../../services/DetalleOCService";
import { ModeloInventario } from "../../enums/ModeloInventario";
import { MetodoPrediccion } from "../../enums/MetodoPrediccion";
import { EstadoOrdenCompra } from "../../enums/EstadoOrdenCompra";
interface RouteParams {
    [key: string]: string | undefined;
    idOrdenCompra: string;
}
function DetallesOCTabla({ordenCompraid}: {ordenCompraid: number}) {
    const[detallesOC, setDetallesOC]=useState<DetalleOrdenCompra[]>([]);
    const navigate = useNavigate();
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchDetallesOC = async () => {
           
                const detallesOC = await DetalleOCService.getDetallesOC(ordenCompraid);
                setDetallesOC(Array.isArray(detallesOC) ? detallesOC : []);
           
        };
        fetchDetallesOC();
    }, [refreshData]);

    console.log(JSON.stringify(detallesOC, null, 2));

    const initializableNewDetalleOC = (): DetalleOrdenCompra => ({
        id: 0,
        cantidadOCD: 0,
        articulo: {
            id: 0,
            nombre: "",
            precio: 0,
            costoAlmacenamiento: 0,
            costoPedido: 0,
            stockActual: 0,
            stockSeguridad: 0,
            cgi: 0,
            demandaAnual: 0,
            modeloInventario: ModeloInventario.LOTE_FIJO,
            loteOptimo: 0,
            puntoPedido: 0,
            cantidadMaxima: 0,
            cantidadAPedir: 0,
            tiempoRevision: 0,
            proveedorPred: {
                id: 0,
                nombreProveedor: "",
            },
            metodoPred: null
        },
        subtotal: 0,
        idOrdenCompra: {
            id: 0,
            fechaOrdenCompra: new Date(),
            totalOrdenCompra: 0,
            estadoOrdenCompra: EstadoOrdenCompra.PENDIENTE,
            proveedor: {
                id: 0,
                nombreProveedor: "",
            }
        }
    })    
    return (
        <div style={{ padding: "20px" }} className="overflow-x-auto">
            <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
                onClick={() => navigate('/orden-de-compra')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left mr-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
                </svg>

                Volver a Ordenes de Compra
            </button>
            <table className="table table-striped table-hover mt-2 shadow-sm">
          <thead>
            <tr>
            {/* id, cantidad, subtotal, id_articulo, id_orden_compra */}
              <th className="py-2 px-4 border-b bg-dark-subtle">ID</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Cantidad</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Subtotal</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Artículo</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Orden de Compra</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {detallesOC.map(detOC => (
              <tr key={detOC.id}>
                <td className="py-2 px-4 border-b">{detOC.id}</td>
                <td className="py-2 px-4 border-b"> {detOC.cantidadOCD}</td>
                <td className="py-2 px-4 border-b">{detOC.subtotal}</td>
                <td className="py-2 px-4 border-b">{detOC.articulo ? detOC.articulo.nombre : 'Sin Articulo'}</td>
                <td className="py-2 px-4 border-b">{detOC.idOrdenCompra ? detOC.idOrdenCompra.id : 'Sin Orden de Compra'}</td>
              </tr>

            ))}
          </tbody>
        </table>
        </div>

    )
}
export default DetallesOCTabla;