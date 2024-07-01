
import { useEffect, useState } from "react";
import { ModalType } from "../../enums/ModalType";
import { OrdenCompra } from "../../types/OrdenCompra";
import { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloService";
import { OrdenCompraService } from "../../services/OrdenCompraService";
import { toast } from "react-toastify";
import { Button, Form, Modal, Table } from "react-bootstrap";


type OrdenCompraModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  ord: OrdenCompra;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrdenCompraModal = ({
  show,
  onHide,
  title,
  modalType,
  ord,
  refreshData,
}: OrdenCompraModalProps) => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null); //Articulo []
  const [cantidad, setCantidad] = useState<number>(0);

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

    fetchArticulos();

  }, [refreshData]);

  const handleSaveUpdate = async () => {
    try {
      const ocDTO = {
        articuloId: articuloSeleccionado?.id || 0,
        cantidad: cantidad,
      };
      await OrdenCompraService.createOrdenCompra(ocDTO);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Orden compra creada exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error('Error al crear la orden:', error);
      toast.error('Error al crear la orden', { position: 'top-center' });
    }
  };


  const handleArticuloSelect = (articulo: Articulo) => {
    setArticuloSeleccionado(articulo);
    setCantidad(0);
  };

  const handleCantidadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(Number(event.target.value));
  };


  return (
    <>
      {modalType === ModalType.DETAIL ? (
        <>
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            {/* <Modal.Body>
             <VentaArticuloTabla ventaID={venta.id} />
            </Modal.Body> */}
            <Modal.Footer>

            </Modal.Footer>

          </Modal>
        </>
      ) : (
        <div >
          <Modal show={show} onHide={onHide} centered className="l" style={{ paddingTop: '400px' }}>
            <Modal.Header closeButton >
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Seleccionar articulo</th>
                      <th>Stock Actual</th>
                      <th>Cantidad a Pedir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articulos.map(articulo => (
                      <tr key={articulo.id}>
                        <td>
                          <Form.Check
                            type="radio"
                            name="articulo"
                            value={articulo.id}
                            checked={articuloSeleccionado?.id === articulo.id}
                            onChange={() => handleArticuloSelect(articulo)}
                          />
                          {articulo.nombre}
                        </td>
                        <td>{articulo.stockActual}</td>
                        <td>
                        {articuloSeleccionado?.id === articulo.id && (
                            <Form.Control
                              type="number"
                              name="cantidad"
                              value={cantidad}
                              onChange={handleCantidadChange}
                              min={0}
                              max={articulo.stockActual}
                              step={1}
                              required
                            />
                          )}
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
        </div>
      )}
    </>
  );

};
export default OrdenCompraModal;