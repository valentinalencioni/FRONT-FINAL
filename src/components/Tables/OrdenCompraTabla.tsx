import { useEffect, useState } from "react";
import { OrdenCompra } from "../../types/OrdenCompra";
import { OrdenCompraService } from "../../services/OrdenCompraService";
import { EstadoOrdenCompra } from "../../enums/EstadoOrdenCompra";
import { ModalType } from "../../enums/ModalType";
import DetalleButton from "../DetalleButton/DetalleButton";

function OrdenCompraTabla() {

  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchOrdenesCompra = async () => {
      try {
        const ordenesCompra = await OrdenCompraService.getOrdenesCompra();
        setOrdenesCompra(Array.isArray(ordenesCompra) ? ordenesCompra : []);
      } catch (error) {
        console.error("Error fetching Ordenes de Compra", error);
      };
    }
    fetchOrdenesCompra();
  }, [refreshData]);

  const initializableNewOrden = (): OrdenCompra => ({
    id: 0,
    fechaOrdenCompra: new Date(),
    totalOrdenCompra: 0,
    estadoOrdenCompra: EstadoOrdenCompra.PENDIENTE,
    proveedor: {
      id: 0,
      nombreProveedor: "",
    },
  });

  const [ordenCompra, setOrdenCompra] = useState<OrdenCompra>(initializableNewOrden);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);

  const handleClick = (title: string, ord: OrdenCompra, modal: ModalType) => {
    setOrdenCompra(ord);
    setTitle(title);
    setShowModal(true);
    setModalType(modal);
  };
  //Otro manejo de funciones como filtrar por estados o confirmar ordenes.

  return (
    <>
      <div className="flex justify-start space-x-2 p-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => handleClick("Nueva orden compra", initializableNewOrden(), ModalType.CREATE)}
        >
          Nueva Orden de Compra
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-dark-subtle">ID</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Fecha</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Total orden</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Estado</th>

              <th className="py-2 px-4 border-b bg-dark-subtle">Proveedor</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Ver detalle</th>
            </tr>
          </thead>
          <tbody>
            {ordenesCompra.map(ordenCompra => (
              <tr>
                <td className="py-2 px-4 border-b">{ordenCompra.id}</td>
                <td className="py-2 px-4 border-b"> {new Date(ordenCompra.fechaOrdenCompra).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{Number(ordenCompra.totalOrdenCompra).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="py-2 px-4 border-b">{ordenCompra.estadoOrdenCompra}</td>
                <td className="py-2 px-4 border-b">{ordenCompra.proveedor ? ordenCompra.proveedor.nombreProveedor : 'Sin Proveedor'}</td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="d-flex justify-content-center">
                    {<DetalleButton onClick={() => handleClick("Ver detalles", ordenCompra, ModalType.DETAIL)} />}
                  </div>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      {showModal && 
      <OrdenCompraModal 
      title={title} 
      ord={ordenCompra} 
      modalType={modalType} 
      setShowModal={setShowModal} 
      setRefreshData={setRefreshData} />}


    </>
  )



}