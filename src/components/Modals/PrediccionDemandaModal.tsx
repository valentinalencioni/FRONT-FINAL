import { useEffect, useState } from "react";
import { ModalType } from "../../enums/ModalType";
import { PrediccionDemanda } from "../../types/PrediccionDemanda";
import { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloService";
import { PrediccionDemandaService } from "../../services/PrediccionDemandaService";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { Table } from "react-bootstrap-icons";
import { Form } from "react-router-dom";

type PrediccionDemandaModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  predi: PrediccionDemanda;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrediccionDemandaModal = ({
  show,
  onHide,
  title,
  modalType,
  predi,
  refreshData
}: PrediccionDemandaModalProps) => {


  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [fechaDesde, setFechaDesde] = useState<Date>(new Date());
  const [fechaHasta, setFechaHasta] = useState<Date>(new Date());
  const [coeficientes, setCoeficientes] = useState<number[]>([]);
  const [mesPrediccion, setMesPrediccion] = useState<number>(0);
  const [anioPrediccion, setAnioPrediccion] = useState<number>(0);
  const [alfa, setAlfa] = useState<number>(0);
  const [cantidadPeriodosAPredecir, setCantidadPeriodosPredecir] = useState<number>(0);
  const [cantidadPeriodosAUsar, setCantidadPeriodosAUsar] = useState<number>(0); //cantidadPeriodosAUsar: number;
  const [cantidadDemandaAnual, setCantidadDemandaAnual] = useState<number>(0);

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


  const handleSave = async () => {
    try {
      const parametrosPrediccionDTO = {
        articuloId: articuloSeleccionado?.id || 0,
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        coeficientes: coeficientes,
        mesPrediccion: mesPrediccion,
        anioPrediccion: anioPrediccion,
        alfa: alfa,
        cantidadPeriodosAPredecir: cantidadPeriodosAPredecir,
        cantidadPeriodosAUsar: cantidadPeriodosAUsar,
        cantidadDemandaAnual: articuloSeleccionado?.demandaAnual || 0
      };
      await PrediccionDemandaService.createPrediccion(parametrosPrediccionDTO);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Prediccion demanda calculada exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error('Error al calcular la demanda:', error);
      toast.error('Error al calcular demanda', { position: 'top-center' });
    }
  };

  const handleErorr = async () => {
    try {
      const parametrosPrediccionDTO = {
        articuloId: articuloSeleccionado?.id || 0,
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        coeficientes: coeficientes,
        mesPrediccion: mesPrediccion,
        anioPrediccion: anioPrediccion,
        alfa: alfa,
        cantidadPeriodosAPredecir: cantidadPeriodosAPredecir,
        cantidadPeriodosAUsar: cantidadPeriodosAUsar,
        cantidadDemandaAnual: articuloSeleccionado?.demandaAnual || 0
      };
      await PrediccionDemandaService.calcularError(parametrosPrediccionDTO);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Prediccion demanda calculada exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error('Error al calcular la demanda:', error);
      toast.error('Error al calcular demanda', { position: 'top-center' });
    }
  };

  const handleDelete = async () => {
    try {
      await PrediccionDemandaService.deletePrediccionDemanda(predi.id);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Prediccion demanda eliminada exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error('Error al eliminar la demanda:', error);
      toast.error('Error al eliminar demanda', { position: 'top-center' });
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
        
      ) :  (
       
      ) 
      }

    </>
  )



}