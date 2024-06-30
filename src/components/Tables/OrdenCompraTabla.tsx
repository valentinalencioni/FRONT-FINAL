import { useEffect, useState } from "react";
import { OrdenCompra } from "../../types/OrdenCompra";
import { OrdenCompraService } from "../../services/OrdenCompraService";
import { Button } from "react-bootstrap";
import { EstadoOrdenCompra } from "../../enums/EstadoOrdenCompra";
import { ModalType } from "../../enums/ModalType";
import { Proveedor } from "../../types/Proveedor";
import DetalleButton from "../DetalleButton/DetalleButton";
import OrdenCompraModal from "../Modals/OrdenCompraModal";


const OrdenCompraTabla = () => {
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchOrdenesCompra = async () => {
      try {
        const ordenesCompra = await OrdenCompraService.getOrdenesCompra();
        setOrdenesCompra(Array.isArray(ordenesCompra) ? ordenesCompra : []);

      } catch (error) {
        console.error("Error fetching Ordenes de Compra", error);
      }
    }
    fetchOrdenesCompra();
  }, [refreshData]);
  console.log(JSON.stringify(ordenesCompra, null, 2));

  const proveedor: Proveedor = {
    id: 0,
    nombreProveedor: '',
  }

  const initializableNewOrdenCompra = (): OrdenCompra => {
    return {
      id: 0,
      fechaOrdenCompra: new Date (),
      totalOrdenCompra: 0,
      estadoOrdenCompra: EstadoOrdenCompra.PENDIENTE,
      proveedor: proveedor,
    }
  }

  const [ordenCompra, setOrdenCompra] = useState<OrdenCompra>(initializableNewOrdenCompra);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  const handleClick = (title: string, ord: OrdenCompra, modal: ModalType) => {
    setOrdenCompra(ord);
    setTitle(title);
    setShowModal(true);
    setModalType(modal);
  };

  return (
    <>
      <div>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => handleClick("Nueva Orden Compra", initializableNewOrdenCompra(), ModalType.CREATE)}
        >
          Nueva Orden de Compra
        </Button>
      </div>

      {/* Selector de Estado
      <div className="mb-4 flex items-center">
        <Form.Select
          value={filtroEstado ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFiltroEstado(e.target.value as EstadoOrdenCompra)
          }
          className="mr-2"
        >
          <option value="">Seleccionar Estado...</option>
          {Object.values(EstadoOrdenCompra).map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </Form.Select>
        <Button
          variant="primary"
          className="py-2 px-4"
          onClick={handleFilterButtonClick}
        >
          Filtrar
        </Button>
      </div> */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b">Fecha</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Proveedor</th>
              <th className="py-2 px-4 border-b">Ver detalle</th>
            </tr>
          </thead>
          <tbody>
            {ordenesCompra.map((ordenCompra) => (
              <tr key={ordenCompra.id} className="border-b">
                <td className="py-2 px-4 center">{ordenCompra.id}</td>
                <td className="py-2 px-4">{ordenCompra.estadoOrdenCompra}</td>
                <td className="py-2 px-4">{new Date(ordenCompra.fechaOrdenCompra).toLocaleDateString()}</td>
                <td className="py-2 px-4">{ordenCompra.totalOrdenCompra}</td>
                <td className="py-2 px-4">{ordenCompra.proveedor.nombreProveedor}</td>
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
      {showModal && (
        <OrdenCompraModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title={'title'}
          modalType={modalType}
          ord={ordenCompra}
          refreshData={setRefreshData}
          />
      )}
    </>
  );
};

export default OrdenCompraTabla;
