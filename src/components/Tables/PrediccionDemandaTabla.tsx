import { useEffect, useState } from "react";
import { PrediccionDemandaService } from "../../services/PrediccionDemandaService";
import { PrediccionDemanda } from "../../types/PrediccionDemanda";
import { ModeloInventario } from "../../enums/ModeloInventario";
import { MetodoPrediccion } from "../../enums/MetodoPrediccion";
import { ModalType } from "../../enums/ModalType";
import DeleteButton from "../DeleteButton/DeleteButton";
import PrediccionDemandaModal from "../Modals/PrediccionDemandaModal";
import { useNavigate } from "react-router-dom";
function PrediccionDemandaTabla() {
    const [prediccionesDemanda, setPrediccionesDemanda] = useState<PrediccionDemanda[]>([]);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchPrediccionesDemanda = async () => {
            try {
                const prediccionesDemanda = await PrediccionDemandaService.getPrediccionesDemanda();
                setPrediccionesDemanda(Array.isArray(prediccionesDemanda) ? prediccionesDemanda : []);
            } catch (error) {
                console.error('Error fetching prediccionesDemanda:', error);
            }
        };

        fetchPrediccionesDemanda();
    }, [refreshData]);

    const initializableNewPrediccionDemanda = (): PrediccionDemanda => ({
        id: 0,
        fechaPrediccion: new Date(),
        valorPrediccion: 0,
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
            modeloInventario: ModeloInventario.INTERVALO_FIJO,
            loteOptimo: 0,
            puntoPedido: 0,
            cantidadMaxima: 0,
            cantidadAPedir: 0,
            tiempoRevision: 0,
            proveedorPred: {
                id: 0,
                nombreProveedor: "",
            },
            metodoPred: MetodoPrediccion.ESTACIONALIDAD,
        },
        demanda: {
            id: 0,
            fechaDesde: new Date(),
            fechaHasta: new Date(),
            totalDemanda: 0,
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
                modeloInventario: ModeloInventario.INTERVALO_FIJO,
                loteOptimo: 0,
                puntoPedido: 0,
                cantidadMaxima: 0,
                cantidadAPedir: 0,
                tiempoRevision: 0,
                proveedorPred: {
                    id: 0,
                    nombreProveedor: "",
                },
                metodoPred: MetodoPrediccion.ESTACIONALIDAD,
            }
        },
        metodoPrediccion: MetodoPrediccion.ESTACIONALIDAD
    });

    const [prediccionDemanda, setPrediccionDemanda] = useState<PrediccionDemanda>(initializableNewPrediccionDemanda);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);

    const handleClick = (title: string, predi: PrediccionDemanda, modal: ModalType) => {
        setPrediccionDemanda(predi);
        setTitle(title);
        setShowModal(true);
        setModalType(modal);
    };
    const navigate = useNavigate();


    return (
        <>
            <div className="flex justify-start space-x-2 mb-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleClick("Nueva prediccion", initializableNewPrediccionDemanda(), ModalType.CREATE)}
                >
                    Nueva Prediccion
                </button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleClick("Asignar Metodo", initializableNewPrediccionDemanda(), ModalType.UPDATE)}
                >
                    Asignar Método
                </button>
                <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => navigate('/metodos')}
                >
                    Ver metodos
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-striped table-hover mt-2 shadow-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-dark-subtle">ID</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Fecha de prediccion</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Valor prediccion</th>
                           
                            <th className="py-2 px-4 border-b bg-dark-subtle">Nombre Articulo</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Metodo de Prediccion</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {prediccionesDemanda.map((prediccionDemanda) => (
                            <tr key={prediccionDemanda.id}>
                                <td className="py-2 px-4 border-b">{prediccionDemanda.id}</td>
                                <td className="py-2 px-4 border-b">
                                    {prediccionDemanda.fechaPrediccion}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {Number(prediccionDemanda.valorPrediccion).toLocaleString("es-ES", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            
                                <td className="py-2 px-4 border-b">{prediccionDemanda.articulo ? prediccionDemanda.articulo.nombre : "Sin Articulo"}</td>
                                <td className="py-2 px-4 border-b">{prediccionDemanda.metodoPrediccion ? prediccionDemanda.metodoPrediccion.replace("_", " ") : "Sin Metodo"}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className="d-flex justify-content-center">
                                        <DeleteButton
                                            onClick={() => handleClick("Eliminar prediccion", prediccionDemanda, ModalType.DELETE)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <PrediccionDemandaModal
                title={title}
                predi={prediccionDemanda}
                modalType={modalType}
                show={showModal}
                onHide={() => setShowModal(false)}
                refreshData={setRefreshData}
              />
            )}
        </>
    )
}
export default PrediccionDemandaTabla;
