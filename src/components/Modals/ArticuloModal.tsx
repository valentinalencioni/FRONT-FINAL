import { useEffect, useState } from "react";
import { ModalType } from "../../enums/ModalType";
import { Articulo } from "../../types/Articulo";
import { Proveedor } from "../../types/Proveedor";
import { ProveedorArticulo } from "../../types/ProveedorArticulo";
import { ModeloInventario } from "../../enums/ModeloInventario";
import { ProveedorService } from "../../services/ProveedorService";
import { ProveedorArticuloService } from "../../services/ProveedorArticuloService";
import { ArticuloService } from "../../services/ArticuloService";
import { toast } from "react-toastify";
import { Button, Form, Modal, Table } from "react-bootstrap";

type ArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  art: Articulo;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArticuloModal = ({
  show,
  onHide,
  title,
  modalType,
  art,
  refreshData,
}: ArticuloModalProps) => {

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [proveedorArt, setProvArt] = useState<ProveedorArticulo[]>([]);
  const [provArtSeleccionado, setProvArtSeleccionado] = useState<ProveedorArticulo | null>(null);
  const [tiempoRevision, setTiempoRevision] = useState<number>(0);
  const [tiempoDemora, setTiempoDemora] = useState<number>(0);
  const [modeloInventario, setModelosInventario] = useState<ModeloInventario>();
  const [costoAlmacenamiento, setCostoAlmacenamiento] = useState<number>(0);
  const [costoPedido, setCostoPedido] = useState<number>(0);
  const [precioArticuloProveedor, setPrecioArticuloProveedor] = useState<number>(0);
  const [stockActual, setStockActual] = useState<number>(0);
  const [nombre, setNombre] = useState<string>("");


  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const proveedores = await ProveedorService.getProveedores();
        setProveedores(Array.isArray(proveedores) ? proveedores : []);
      } catch (error) {
        console.error("Error fetching proveedores: ", error);
        setProveedores([]);
      }
    };
    const fetchProveedoresArt = async () => {
      if (modalType === ModalType.PROVE && art.id)
        try {
          const proveedorArt = await ProveedorArticuloService.findbyArticulo(art.id);
          setProvArt(Array.isArray(proveedorArt) ? proveedorArt : []);
        } catch (error) {
          console.error("Error fetching proveedorArt: ", error);
          setProvArt([]);
        }
    };
    fetchProveedores();
    fetchProveedoresArt();

  }, [refreshData]);

  const handleSave = async () => {
    try {
      const crearArticuloDTO = {
        nombre,
        stockActual,
        modeloInventario: ModeloInventario.LOTE_FIJO,
        tiempoRevision,
        idProveedorPred: proveedorSeleccionado?.id || 0,
        tiempoDemora,
        costoAlmacenamiento,
        costoPedido,
        precioArticuloProveedor,
      };
      await ArticuloService.createArticulo(crearArticuloDTO);

      onHide();
      refreshData(prevState => !prevState);
      toast.success('Articulo creado exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar el articulo', { position: 'top-center' });
    }
  };
  const handleCalculate = async () => {
    try {
      await ArticuloService.calcularTodo(art.id)
      toast.success("Valores calculados", {
        position: "top-center",
      })
      console.log("Calculando")
      onHide();
      refreshData(prevState => !prevState);
    } catch (error) {
      toast.error("Ocurrió un error");
    }
  };

  const handleDelete = async () => {
    try {
      await ArticuloService.deleteArticulo(art.id);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Articulo eliminado exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar el articulo', { position: 'top-center' });
    }
  };

  const handleCambioProv = async () => {
    try {
      await ArticuloService.cambiarProveedor(art.proveedorPred.id,art.id);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Proveedor cambiado exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Error al cambiar el proveedor', { position: 'top-center' });
    }
  };
  const handleCambioMod = async () => {
    try {
      await ArticuloService.modeloArticulo(art.id);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Modelo cambiado exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Error al cambiar el modelo', { position: 'top-center' });
    }
  };


  return (
    <>
      {modalType === ModalType.DELETE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Seguro que desea eliminar este articulo?</p>
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
      ) : modalType === ModalType.CREATE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  placeholder="Ingrese el nombre del artículo"
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
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
                <Form.Label>Stock Actual</Form.Label>
                <Form.Control
                  type="number"
                  value={stockActual}
                  onChange={(e) => setStockActual(Number(e.target.value))}
                  min={0}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Modelo de Inventario</Form.Label>
                <Form.Control
                  as="select"
                  value={modeloInventario}
                  required
                  onChange={(e) => setModelosInventario(e.target.value as ModeloInventario | undefined || ModeloInventario.LOTE_FIJO)}
                >
                  <option value={ModeloInventario.LOTE_FIJO}>Lote Fijo</option>
                  <option value={ModeloInventario.INTERVALO_FIJO}>Intervalo Fijo</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Tiempo de Demora</Form.Label>
                <Form.Control
                  type="number"
                  value={tiempoDemora}
                  onChange={(e) => setTiempoDemora(Number(e.target.value))}
                  min={0}
                  required

                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Costo de Pedido</Form.Label>
                <Form.Control
                  type="number"
                  value={costoPedido}
                  onChange={(e) => setCostoPedido(Number(e.target.value))}
                  min={0}
                  required

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
                  required

                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Precio Proveedor Artículo</Form.Label>
                <Form.Control
                  type="number"
                  value={precioArticuloProveedor}
                  onChange={(e) => setPrecioArticuloProveedor(Number(e.target.value))}
                  min={0}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tiempo de Revision</Form.Label>
                <Form.Control
                  type="number"
                  value={tiempoRevision}
                  onChange={(e) => setTiempoRevision(Number(e.target.value))}
                  min={0}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleSave}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      ) : modalType === ModalType.DETAIL ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">

          <Modal.Header closeButton>
            <Modal.Title>{art.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="overflow-x-auto">
              <Table className='min-w-full bg-white border border-gray-300'>
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b">Nombre</th>
                    <th className="py-2 px-4 border-b">Precio</th>
                    <th className="py-2 px-4 border-b">CGI</th>
                    <th className="py-2 px-4 border-b">Lote Óptimo</th>
                    <th className="py-2 px-4 border-b">Punto de Pedido</th>
                    <th className="py-2 px-4 border-b">Modelo Inventario</th>
                    <th className="py-2 px-4 border-b">Cantidad a Pedir</th>
                    <th className="py-2 px-4 border-b"> Cantidad Maxima</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">{art.nombre}</td>
                    <td className="py-2 px-4 border-b">{art.precio}</td>
                    <td className="py-2 px-4 border-b">{art.cgi}</td>
                    <td className="py-2 px-4 border-b">{art.loteOptimo}</td>
                    <td className="py-2 px-4 border-b">{art.puntoPedido}</td>
                    <td className="py-2 px-4 border-b">{art.modeloInventario.replace('_', ' ')}</td>
                    <td className="py-2 px-4 border-b">{art.cantidadAPedir}</td>
                    <td className="py-2 px-4 border-b">{art.cantidadMaxima}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cerrar</Button>
            <Button variant="primary" onClick={handleCalculate}>Calcular Valores</Button>
          </Modal.Footer>
        </Modal>
      ): modalType === ModalType.INVEN ?(
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Seguro que desea cambiar el Modelo Inventario?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleCambioMod}>
              Cambiar
            </Button>
          </Modal.Footer>
        </Modal>
      ): modalType === ModalType.PROVE ?(
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Seleccionar Proveedor al que desee cambiar</Form.Label>
                <Form.Control
                  as="select"
                  value={provArtSeleccionado?.id || ""}
                  onChange={(e) => setProvArtSeleccionado(proveedorArt.find(p => p.id === Number(e.target.value)) || null)}
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedorArt.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.proveedor?.nombreProveedor}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleCambioProv}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      ): null
    }

    </>
  );

};

export default ArticuloModal;


