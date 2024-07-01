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

    const handleClick = (title: string, venta: Venta, modal: ModalType) => {
        setVenta(venta);
        setTitle(title);
        setShowModal(true);
        setModalType(modal);
    };

    return (
        <>
            <div className="flex justify-end space-x-2 p-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={() => handleClick("Nueva Venta", initializableNewVenta(), ModalType.CREATE)}
                >
                    Nueva Venta
                </button>
            </div>
            <div>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Id</th>
                            <th className="py-2 px-4 border-b">Total Venta</th>
                            <th className="py-2 px-4 border-b">Fecha de Venta</th>
                            <th className="py-2 px-4 border-b">Ver Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((venta) => (
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
