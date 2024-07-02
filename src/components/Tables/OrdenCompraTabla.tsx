import { SetStateAction, useEffect, useState } from "react";
import { OrdenCompra } from "../../types/OrdenCompra";
import { OrdenCompraService } from "../../services/OrdenCompraService";
import { EstadoOrdenCompra } from "../../enums/EstadoOrdenCompra";
import { ModalType } from "../../enums/ModalType";
import DetalleButton from "../DetalleButton/DetalleButton";
import OrdenCompraModal from "../Modals/OrdenCompraModal";
import DeleteButton from "../DeleteButton/DeleteButton";
import EditButton from "../EditButton/EditButton";
import { useNavigate } from "react-router-dom";

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
  const [search, setSearch] = useState("");




  const handleClick = (title: string, ord: OrdenCompra, modal: ModalType) => {
    setOrdenCompra(ord);
    setTitle(title);
    setShowModal(true);
    setModalType(modal);
  };
  //Otro manejo de funciones como filtrar por estados o confirmar ordenes.

  //Metodo de filtrado 
  let results: any[] = []
  if (!search) {
    results = ordenesCompra
  } else {
    results = ordenesCompra.filter((dato: { estadoOrdenCompra: string; }) =>
      dato.estadoOrdenCompra.toLowerCase().includes(search.toLowerCase())
    )
  }

  //funcion de busqueda 
  const searcher = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearch(e.target.value)
    console.log(e.target.value);
  }

  const navigate = useNavigate();
  return (
    <>
      <div className="p-4">
        <input value={search} onChange={searcher} type="text" placeholder="Buscar Ordenes por Estado" className="form-control" />
      </div>
      <div className="flex justify-start space-x-2 ">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => handleClick("Nueva orden compra", initializableNewOrden(), ModalType.CREATE)}
        >
          Nueva Orden de Compra
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-striped table-hover mt-2 shadow-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-dark-subtle">ID</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Fecha</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Total orden</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Estado</th>

              <th className="py-2 px-4 border-b bg-dark-subtle">Proveedor</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Ver detalle</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Modificar</th>
              <th className="py-2 px-4 border-b bg-dark-subtle">Eliminar</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {results.map(ordenCompra => (
              <tr>
                <td className="py-2 px-4 border-b">{ordenCompra.id}</td>
                <td className="py-2 px-4 border-b"> {new Date(ordenCompra.fechaOrdenCompra).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{Number(ordenCompra.totalOrdenCompra).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="py-2 px-4 border-b">{ordenCompra.estadoOrdenCompra}</td>
                <td className="py-2 px-4 border-b">{ordenCompra.proveedor ? ordenCompra.proveedor.nombreProveedor : 'Sin Proveedor'}</td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="d-flex justify-content-center">
                    {<DetalleButton onClick={() => navigate('/detallesOC')} />}
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="d-flex justify-content-center">
                    {<EditButton onClick={() => handleClick("Editar orden de compra", ordenCompra, ModalType.UPDATE)} />}
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="d-flex justify-content-center">
                    {<DeleteButton onClick={() => handleClick("Eliminar orden de compra", ordenCompra, ModalType.DELETE)} />}
                  </div>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      <OrdenCompraModal
        title={title}
        ord={ordenCompra}
        modalType={modalType}
        show={showModal}
        onHide={() => setShowModal(false)}
        refreshData={setRefreshData}
      />
    </>
  );



}

export default OrdenCompraTabla;