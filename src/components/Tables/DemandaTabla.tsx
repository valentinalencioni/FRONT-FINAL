import { useEffect, useState } from "react";
import { Demanda } from "../../types/Demanda";
import { DemandaService } from "../../services/DemandaService";
import { ModeloInventario } from "../../enums/ModeloInventario";
import { MetodoPrediccion } from "../../enums/MetodoPrediccion";
import { ModalType } from "../../enums/ModalType";
import DeleteButton from "../DeleteButton/DeleteButton";
import DemandaModal from "../Modals/DemandaModal";

function DemandaTabla() {
    const [demandas, setDemandas] = useState<Demanda[]>([]);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchDemandas = async () => {
            try {
                const demandas = await DemandaService.getDemandas();
                setDemandas(Array.isArray(demandas) ? demandas : []);
            } catch (error) {
                console.error("Error fetching demandas:", error);
            }
        };
        fetchDemandas();
    }, [refreshData]);
    console.log(JSON.stringify(demandas, null, 2));


    const initializableNewDemanda = (): Demanda => ({
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
        },
    });

    const [demanda, setDemanda] = useState<Demanda>(initializableNewDemanda);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);

    const handleClick = (title: string, dem: Demanda, modal: ModalType) => {
        setDemanda(dem);
        setTitle(title);
        setShowModal(true);
        setModalType(modal);
    };
    return (
        <>
            <div className="flex justify-start space-x-2 ">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={() => handleClick("Nueva demanda", initializableNewDemanda(), ModalType.CREATE)}
                >
                    Calcular Demanda
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-striped table-hover mt-2 shadow-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-dark-subtle">ID</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Fecha desde</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Fecha hasta</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Total demanda</th>

                            <th className="py-2 px-4 border-b bg-dark-subtle">Id Articulo</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {demandas.map(demanda => (
                            <tr>
                                <td className="py-2 px-4 border-b">{demanda.id}</td>
                                <td className="py-2 px-4 border-b"> {new Date(demanda.fechaDesde).toLocaleString()}</td>
                                <td className="py-2 px-4 border-b"> {new Date(demanda.fechaHasta).toLocaleString()}</td>
                                <td className="py-2 px-4 border-b">{demanda.totalDemanda}</td>
                                <td className="py-2 px-4 border-b">{demanda.articulo.id}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className="d-flex justify-content-center">
                                        {<DeleteButton onClick={() => handleClick("Eliminar demanda", demanda, ModalType.DELETE)} />}
                                    </div>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
            {/* Agregar Modal */}
            <DemandaModal
                title={title}
                dem={demanda}
                modalType={modalType}
                show={showModal}
                onHide={() => setShowModal(false)}
                refreshData={setRefreshData}
            />

        </>
    )


}


export default DemandaTabla;