import { Articulo } from "../../types/Articulo";

import EditButton from "../EditButton/EditButton"
import { useNavigate } from "react-router-dom";
import ArticuloModal from "../Modals/ArticuloModal";
import { useState, useEffect } from "react";
import { ArticuloService } from "../../services/ArticuloService";
import { Proveedor } from "../../types/Proveedor";
import { ModeloInventario } from "../../enums/ModeloInventario";
import { ProveedorArticulo } from "../../types/ProveedorArticulo";
import { ProveedorArticuloService } from "../../services/ProveedorArticuloService";
import { MetodoPrediccion } from "../../enums/MetodoPrediccion";
import { ModalType } from "../../enums/ModalType";
import DetalleButton from "../DetalleButton/DetalleButton";
import DeleteButton from "../DeleteButton/DeleteButton";





function ArticuloTable() {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [refreshData, setRefreshData] = useState(false);
    const [proveedores, setProveedores] = useState<ProveedorArticulo[]>([]);

    useEffect(() => {
        const fetchArticulos = async () => {
            try {

                const articulos = await ArticuloService.getArticulos();
                setArticulos(Array.isArray(articulos) ? articulos : []);
            } catch (error) {
                console.error("Error fetching articulos:", error)
            };
        }
        fetchArticulos();
    }, [refreshData]);
    console.log(JSON.stringify(articulos, null, 2));

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const proveedores = await ProveedorArticuloService.getProveedoresArt();
                setProveedores(Array.isArray(proveedores) ? proveedores : []);
            } catch (error) {
                console.error("Error obteniendo los ProveedorArticulo: ", error);
                setProveedores([]);
            }
        };
        fetchProveedores();
    }, [refreshData]);
    console.log(JSON.stringify(proveedores, null, 2));

    const initializableNewArticulo = (): Articulo => {
        return {
            id: 0,
            cantidadAPedir: 0,
            cantidadMaxima: 0,
            cgi: 0,
            costoAlmacenamiento: 0,
            costoPedido: 0,
            demandaAnual: 0,
            loteOptimo: 0,
            modeloInventario: ModeloInventario.LOTE_FIJO,
            nombre: '',
            precio: 0,
            puntoPedido: 0,
            stockActual: 0,
            stockSeguridad: 0,
            tiempoRevision: 0,
            proveedorPred:{
                id: 0,
                nombreProveedor: '',
            },
            metodoPred: null,
        };
    };

    const [articulo, setArticulo] = useState<Articulo>(initializableNewArticulo);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    const [title, setTitle] = useState("");

    const handleClick = (title: string, art: Articulo, modal: ModalType) => {
        setArticulo(art);
        setTitle(title);
        setShowModal(true);
        setModalType(modal);
    };

    const navigate = useNavigate();


    return (
        <>
            <div className="flex justify-start space-x-2 p-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={() => handleClick("Nuevo articulo", initializableNewArticulo(), ModalType.CREATE)}
                >
                    Nuevo articulo
                </button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={() => navigate('/articulos-faltantes')}
                >
                    Artículos Faltantes
                </button>
                <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={() => navigate('/articulos-a-reponer')}
                >
                    Artículos a Reponer
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-striped table-hover mt-2 shadow-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Articulo</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Precio</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Stock actual</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Proveedor predeterminado</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Modelo Inventario</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Ver detalle</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Cambiar Modelo Inventario</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Cambiar Proveedor</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articulos.map(articulo => (
                            <tr>
                                <td className="py-2 px-4 border-b">{articulo.nombre}</td>
                                <td className="py-2 px-4 border-b"> {Number(articulo.precio).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 border-b">{articulo.stockActual}</td>
                                <td className="py-2 px-4 border-b">{articulo.proveedorPred ? articulo.proveedorPred.nombreProveedor : 'Sin Proveedor'}</td>
                                <td className="py-2 px-4 border-b">{articulo.modeloInventario.replace('_', ' ')}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className="d-flex justify-content-center">
                                        {<DetalleButton onClick={() => handleClick("Ver detalles", articulo, ModalType.DETAIL)} />}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-4"
                                        onClick={() => handleClick("Cambiar modelos Inventario", articulo, ModalType.INVEN)}
                                    >
                                        Cambiar Inventario
                                    </button>
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
                                        onClick={() => handleClick("Cambiar Proveedor", articulo, ModalType.PROVE)}
                                    >
                                        Cambiar Proveedor
                                    </button>
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className="d-flex justify-content-center">
                                        {<DeleteButton onClick={() => handleClick("Eliminar articulo", articulo, ModalType.DELETE)} />}
                                    </div>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <ArticuloModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    title={title}
                    modalType={modalType}
                    art={articulo}
                    refreshData={setRefreshData}
                />
            )}
        </>
    );
}

export default ArticuloTable;
