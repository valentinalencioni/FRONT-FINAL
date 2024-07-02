import { useEffect, useState } from "react";
import { VentaService } from "../../services/VentaService";
import { ModalType } from "../../enums/ModalType";
import VentaModal from "../Modals/VentaModal"; // Importar VentaModal
import { Venta } from "../../types/Venta";
import DetalleButton from "../DetalleButton/DetalleButton";

function VentaTabla() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const ventas = await VentaService.getVentas();
                setVentas(Array.isArray(ventas) ? ventas : []);
            } catch (error) {
                console.error("Error fetching ventas:", error);
            }
        };
        fetchVentas();
    }, [refreshData]);

    console.log(JSON.stringify(ventas, null, 2));

    const initializableNewVenta = (): Venta => ({
        id: 0,
        fechaVenta: new Date(),
        totalVenta: 0,
    });

    const [venta, setVenta] = useState<Venta>(initializableNewVenta);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    const [title, setTitle] = useState("");
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);

    const handleClick = (title: string, venta: Venta, modal: ModalType) => {
        setVenta(venta);
        setTitle(title);
        setShowModal(true);
        setModalType(modal);
    };

    const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFechaInicio(new Date(e.target.value));
        console.log("Fecha de inicio:", e.target.value);
    };

    const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFechaFin(new Date(e.target.value));
        console.log("Fecha de fin:", e.target.value);
    };

    // Método de filtrado
    const ventasFiltradas = ventas.filter(venta => {
        const fechaVenta = new Date(venta.fechaVenta);
        return (
            (!fechaInicio || fechaVenta >= fechaInicio) &&
            (!fechaFin || fechaVenta <= fechaFin)
        );
    });

    return (
        <>
            <div className="text-center justify-center">
                    <h1 className="text-xl font-bold text-center">
                        Filtrar ventas por fechas
                    </h1>
                    <div className="flex text-center justify-center">
                        <div className="flex flex-col p-4">
                            <h2 className="font-bold p-2 text-center">
                                Fecha desde:
                            </h2>
                            
                            <input
                                type="date"
                                value={fechaInicio ? fechaInicio.toISOString().substring(0, 10) : ""}
                                onChange={handleFechaInicioChange}
                                className="pr-4"
                        />
                        </div>
                        <div className="flex flex-col p-4">
                            <h2 className="font-bold p-2 text-center">
                                Fecha hasta:
                            </h2>
                            
                            <input
                                type="date"
                                value={fechaFin ? fechaFin.toISOString().substring(0, 10) : ""}
                                onChange={handleFechaFinChange}
                                className= "pr-4"
                                
                            />
                        </div>
                        
                        
                    </div>
                    
              
            </div>
            <div className="flex justify-end space-x-2 p-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={() => handleClick("Nueva Venta", initializableNewVenta(), ModalType.CREATE)}
                >
                    Nueva Venta
                </button>
            </div>
            <div>
                <table className="table table-striped table-hover mt-2 shadow-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Id</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Total Venta</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Fecha de Venta</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Ver Detalle</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {ventasFiltradas.map((venta) => (
                            <tr key={venta.id}>
                                <td className="py-2 px-4 border-b">{venta.id}</td>
                                <td className="py-2 px-4 border-b">{venta.totalVenta}</td>
                                <td className="py-2 px-4 border-b">{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                                { <td className="py-2 px-4 border-b">
                                    {<DetalleButton onClick={() => handleClick("Ver detalle de venta", venta, ModalType.DETAIL)} />}
                                </td> }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <VentaModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    modalType={modalType} // Use modalType instead of ModalType
                    venta={venta}
                    refreshData={setRefreshData} 
                    title={title}                
                />
            )}
        </>
    );
}

export default VentaTabla;
