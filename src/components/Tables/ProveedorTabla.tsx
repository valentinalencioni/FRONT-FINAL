import { useEffect, useState } from "react";
import { Proveedor } from "../../types/Proveedor";
import { ModalType } from "../../enums/ModalType";
import { ProveedorService } from "../../services/ProveedorService";
import ProveedorModal from "../Modals/ProveedorModal";
import { useNavigate } from "react-router-dom";







function ProveedorTabla() {

    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const proveedores = await ProveedorService.getProveedores();
                setProveedores(Array.isArray(proveedores) ? proveedores : []);
            } catch (error) {
                console.error("Error fetching proveedores", error);
                setProveedores([]);
            }
        };
        fetchProveedores();
    }, [refreshData]);
    console.log(JSON.stringify(proveedores, null, 2));

    const initializableNewProveedor = (): Proveedor => ({
        id: 0,
        nombreProveedor: "",
    })

    const [proveedor, setProveedor] = useState<Proveedor>(initializableNewProveedor);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const handleClick = (title: string, prov: Proveedor, modal: ModalType) => {
        setProveedor(prov);
        setTitle(title);
        setShowModal(true);
        setModalType(modal);
    };


    return (
        <>
            <div className="flex justify-start space-x-2 p-4">
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
                    onClick={() => navigate('/proveedor-articulo')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left mr-2" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
                    </svg>

                    Volver a Proveedores
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={() => handleClick("Nuevo proveedor", initializableNewProveedor(), ModalType.CREATE)}
                >
                    Nuevo Proveedor
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-dark-subtle">ID</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map(proveedor => (
                            <tr>
                                <td className="py-2 px-4 border-b">{proveedor.id}</td>
                                <td className="py-2 px-4 border-b">{proveedor.nombreProveedor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <ProveedorModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    title={title}
                    modalType={modalType}
                    prov={proveedor}
                    refreshData={setRefreshData}
                />
            )}
        </>
    );
}

export default ProveedorTabla;
