import { useEffect, useState } from "react";
import { ModalType } from "../../enums/ModalType";
import { OrdenCompra } from "../../types/OrdenCompra";
import { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloService";
import { OrdenCompraService } from "../../services/OrdenCompraService";
import { toast } from "react-toastify";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { ProveedorArticulo } from "../../types/ProveedorArticulo";
import { Proveedor } from "../../types/Proveedor";
import { ProveedorArticuloService } from "../../services/ProveedorArticuloService";
import { ProveedorService } from "../../services/ProveedorService";


type ProveedorArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  prova: ProveedorArticulo;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProveedorArticuloModal = ({
  show,
  onHide,
  title,
  modalType,
  prova,
  refreshData,
}: ProveedorArticuloModalProps) => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [tiempoDemora, setTiempoDemora] = useState<number>(0);
  const [costoAlmacenamiento, setCostoAlmacenamiento] = useState<number>(0);
  const [costoPedido, setCostoPedido] = useState<number>(0);
  const [precioArticuloProveedor, setPrecioArticuloProveedor] = useState<number>(0);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const articulos = await ArticuloService.getArticulos();
        setArticulos(Array.isArray(articulos) ? articulos : []);
      } catch (error) {
        console.error("Error fetching articulos: ", error);
        setArticulos([]);
      }
    };    

    const fetchProveedores = async () => {
      try {
        const proveedores = await ProveedorService.getProveedores();
        setProveedores(Array.isArray(proveedores) ? proveedores : []);
      } catch (error) {
        console.error("Error fetching proveedores: ", error);
        setProveedores([]);
      }
    };

    fetchArticulos();
    fetchProveedores();
  }, [refreshData]);

  const handleSaveUpdate = async () => {
    try {
      const crearPADTO = {
        idArticulo: articuloSeleccionado?.id || 0,
        tiempoDemora,
        costoAlmacenamiento,
        costoPedido,
        precioArticuloProveedor,
        idProveedor: proveedorSeleccionado?.id || 0,
      };

      await ProveedorArticuloService.createProveedorArt(crearPADTO);

      onHide();
      refreshData(prevState => !prevState);
      toast.success('Proveedor articulo creado exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar el Proveedor articulo', { position: 'top-center' });
    }
  };

  const handleDelete = async () => {
    try {
      await OrdenCompraService.deleteOrdenCompra(prova.id);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Orden de compra eliminada exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la orden', { position: 'top-center' });
    }
  };

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <>
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>¿Seguro que desea eliminar este Proveedor Articulo?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Modal show={show} onHide={onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Seleccionar Artículo</Form.Label>
                <Form.Control
                  as="select"
                  value={articuloSeleccionado?.id || ""}
                  onChange={(e) => setArticuloSeleccionado(articulos.find(a => a.id === Number(e.target.value)) || null)}
                >
                  <option value="">Seleccione un artículo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Seleccionar Proveedor</Form.Label>
                <Form.Control
                  as="select"
                  value={proveedorSeleccionado?.id || ""}
                  onChange={(e) => setProveedorSeleccionado(proveedores.find(p => p.id === Number(e.target.value)) || null)}
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombreProveedor}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Tiempo de Demora</Form.Label>
                <Form.Control
                  type="number"
                  value={tiempoDemora}
                  onChange={(e) => setTiempoDemora(Number(e.target.value))}
                  min={0}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Costo de Pedido</Form.Label>
                <Form.Control
                  type="number"
                  value={costoPedido}
                  onChange={(e) => setCostoPedido(Number(e.target.value))}
                  min={0}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Costo de Almacenamiento</Form.Label>
                <Form.Control
                  type="number"
                  value={costoAlmacenamiento}
                  onChange={(e) => setCostoAlmacenamiento(Number(e.target.value))}
                  min={0}
                  step="0.01"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Precio Proveedor Artículo</Form.Label>
                <Form.Control
                  type="number"
                  value={precioArticuloProveedor}
                  onChange={(e) => setPrecioArticuloProveedor(Number(e.target.value))}
                  min={0}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleSaveUpdate}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ProveedorArticuloModal;
