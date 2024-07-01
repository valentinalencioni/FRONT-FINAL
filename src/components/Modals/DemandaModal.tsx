import { useEffect, useState } from "react";
import { ModalType } from "../../enums/ModalType";
import { Demanda } from "../../types/Demanda";
import { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloService";
import { DemandaService } from "../../services/DemandaService";
import { toast } from "react-toastify";
import { Button, Form, Modal, Table } from "react-bootstrap";




type DemandaModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  dem: Demanda;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const DemandaModal = ({
  show,
  onHide,
  title,
  modalType,
  dem,
  refreshData,
}: DemandaModalProps) => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null); //Articulo []
  const [fechaDesde, setFechaDesde] = useState<Date>(new Date());
  const [fechaHasta, setFechaHasta] = useState<Date>(new Date());

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
      const DemandaDTO = {
        articuloId: articuloSeleccionado?.id || 0,
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
      };
      await DemandaService.calculateDemanda(DemandaDTO);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Demanda calculada exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error('Error al calcular la demanda:', error);
      toast.error('Error al calcular demanda', { position: 'top-center' });
    }
  };



  const handleDelete = async () => {
    try {
      await DemandaService.deleteDemanda(dem.id);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Demanda eliminada exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la demanda', { position: 'top-center' });
    }
  };



  const handleArticuloSelect = (articulo: Articulo) => {
    setArticuloSeleccionado(articulo);
  };
  const handleFechaDesdeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaDesde(new Date(event.target.value));
  };

  const handleFechaHastaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaHasta(new Date(event.target.value));
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
              <p>¿Seguro que desea eliminar esta demanda?</p>
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
                      <th>Fecha desde</th>
                      <th>Fecha hasta</th>
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
                        <td>
                          <Form.Control
                            type="date"
                            value={fechaDesde.toISOString().split('T')[0]}
                            onChange={handleFechaDesdeChange}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="date"
                            value={fechaHasta.toISOString().split('T')[0]}
                            onChange={handleFechaHastaChange}
                          />
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
export default DemandaModal;