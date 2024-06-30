import { useEffect, useState } from "react";
import { VentaService } from "../../services/VentaService";
import { ModalType } from "../../enums/ModalType";
import DetalleButton from "../DetalleButton/DetalleButton";
import { Venta } from "../../types/Venta";
import VentaModal from "../Modals/VentaModal";
//Import VentaModal

function VentaTabla() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [refreshData, setRefreshData] = useState(false);

    //Aca traigo ventas
    useEffect(() => {
        const fetchVentas = async () => {
            try {

                const ventas = await VentaService.getVentas();
                setVentas(Array.isArray(ventas) ? ventas : []);
            } catch (error) {
                console.error("Error fetching ventas:", error)
            };
        }
        fetchVentas();
    }, [refreshData]);
    console.log(JSON.stringify(ventas, null, 2));
    //Aca voy a implementar logica para crear venta y seteo valores necesarios

    const initializableNewVenta = ():Venta =>({
        id:0,
        fechaVenta: new Date (),
        totalVenta: 0,
    });
    const [venta, setVenta] = useState<Venta>(initializableNewVenta);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    const [nombre, setNombre] = useState("");

    const handleClick = (nombre: string, venta: Venta, modal: ModalType) => {
        setVenta(venta);
        setNombre(nombre);
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
                                {/* <td className="py-2 px-4 border-b">
                                    {<DetalleButton onClick={() => handleClick("Ver detalle de venta", venta, ModalType.DETAIL)} />}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Agregar ShowModal */}
             {showModal && (
                <VentaModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    nombre={nombre}
                    modalType={modalType}
                    venta={venta}
                    refreshData={setRefreshData}
                />
            )} 
        </>
    )

}

export default VentaTabla;