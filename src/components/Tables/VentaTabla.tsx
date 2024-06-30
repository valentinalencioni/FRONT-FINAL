import { useEffect, useState } from "react";
import { VentaService } from "../../services/VentaService";
import { ModalType } from "../../enums/ModalType";
import DetalleButton from "../DetalleButton/DetalleButton";
import { Venta } from "../../types/Venta";
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
    // const 
    // const [venta, setVenta] = useState <Venta>(initializableNewVenta);
    // const [showModal, setShowModal] = useState(false);
    // const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    // const [title, setTitle] = useState("");
    
    // const handleClick = (title: string, venta: Venta, modal: ModalType) => {
    //     setVenta(venta);
    //     setTitle(title);
    //     setShowModal(true);
    //     setModalType(modal);
    // };


    return (
        <>
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
            {/* {showModal && (
                <VentaModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    nombre={nombre}
                    modalType={modalType}
                    venta={venta}
                    refreshData={setRefreshData}
                />
            )} */}
        </>
    )

}

export default VentaTabla;