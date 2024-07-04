import { useEffect, useState } from "react";
import { ModalType } from "../../enums/ModalType";
import { PrediccionDemanda } from "../../types/PrediccionDemanda";
import { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloService";
import { PrediccionDemandaService } from "../../services/PrediccionDemandaService";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";

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
  const [coeficientes, setCoeficientes] = useState<Array<number>>([]);
  const [mesPrediccion, setMesPrediccion] = useState<number>(0);
  const [anioPrediccion, setAnioPrediccion] = useState<number>(0);
  const [alfa, setAlfa] = useState<number>(0);
  const [cantidadPeriodosAPredecir, setCantidadPeriodosAPredecir] = useState<number>(0);
  const [cantidadPeriodosAUsar, setCantidadPeriodosAUsar] = useState<number>(0); //cantidadPeriodosAUsar: number;
  const [coeficientesError, setCoeficientesError] = useState<string>('');
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

  const handleError = async () => {
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
  const handleFechaDesdeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaDesde(new Date(event.target.value));
  };

  const handleFechaHastaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaHasta(new Date(event.target.value));
  };

  
  const handleCoeficientesChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    const coefArray = value.split(',').map((val: string) => val.trim());
  
    const isValid = coefArray.every((val: string) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 1;
    });
  
    if (isValid) {
        setCoeficientes(coefArray);
        setCoeficientesError('');
    } else {
        setCoeficientesError('Todos los coeficientes deben ser números entre 0 y 1.');
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
            <p>¿Seguro que desea eliminar esta prediccion?</p>
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
              <Form.Group>
                <Form.Label>Seleccionar Articulo</Form.Label>
                <Form.Control
                  as="select"
                  value={articuloSeleccionado?.id || ""}
                  onChange={(e) => setArticuloSeleccionado(articulos.find(p => p.id === Number(e.target.value)) || null)}
                >
                  <option value="">Seleccione un articulo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Fecha Desde</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaDesde.toISOString().split('T')[0]}
                  onChange={handleFechaDesdeChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Fecha Hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaHasta.toISOString().split('T')[0]}
                  onChange={handleFechaHastaChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Coeficientes</Form.Label>
                <Form.Control type="text"
                 value={coeficientes.join(',')} 
                 onChange={handleCoeficientesChange} 
                 placeholder="Ingrese los coeficientes separados por coma"
                  />
                  {coeficientesError && <Form.Text className="text-danger">{coeficientesError}</Form.Text>}
              </Form.Group>
              <Form.Group>
                <Form.Label>Mes Prediccion</Form.Label>
                <Form.Control
                  type="number"
                  value={mesPrediccion}
                  onChange={(e) => setMesPrediccion(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Año Prediccion</Form.Label>
                <Form.Control
                  type="number"
                  value={anioPrediccion}
                  onChange={(e) => setAnioPrediccion(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Alfa</Form.Label>
                <Form.Control
                  type="number"
                  value={alfa}
                  onChange={(e) => setAlfa(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cantidad Periodos A Predecir</Form.Label>
                <Form.Control
                  type="number"
                  value={cantidadPeriodosAPredecir}
                  onChange={(e) => setCantidadPeriodosAPredecir(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cantidad Periodos A Usar</Form.Label>
                <Form.Control
                  type="number"
                  value={cantidadPeriodosAUsar}
                  onChange={(e) => setCantidadPeriodosAUsar(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Demanda Anual de articulo</Form.Label>
                <Form.Control
                  type="number"
                  value={articuloSeleccionado?.demandaAnual || ""}
                  onChange={(e) => setCantidadDemandaAnual(Number(e.target.value))}
                  disabled
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
      ) : modalType === ModalType.UPDATE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Seleccionar Articulo</Form.Label>
                <Form.Control
                  as="select"
                  value={articuloSeleccionado?.id || ""}
                  onChange={(e) => setArticuloSeleccionado(articulos.find(p => p.id === Number(e.target.value)) || null)}
                >
                  <option value="">Seleccione un articulo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Fecha Desde</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaDesde.toISOString().split('T')[0]}
                  onChange={handleFechaDesdeChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Fecha Hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaHasta.toISOString().split('T')[0]}
                  onChange={handleFechaHastaChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Coeficientes</Form.Label>
                <Form.Control type="text"
                  value={coeficientes.join(';')}
                  onChange={handleCoeficientesChange}
                  placeholder="Ingrese los coeficientes separados por punto y coma"
                />
                {coeficientesError && <Form.Text className="text-danger">{coeficientesError}</Form.Text>}
              </Form.Group>
              <Form.Group>
                <Form.Label>Mes Prediccion</Form.Label>
                <Form.Control
                  type="number"
                  value={mesPrediccion}
                  onChange={(e) => setMesPrediccion(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Año Prediccion</Form.Label>
                <Form.Control
                  type="number"
                  value={anioPrediccion}
                  onChange={(e) => setAnioPrediccion(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Alfa</Form.Label>
                <Form.Control
                  type="number"
                  value={alfa}
                  onChange={(e) => setAlfa(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cantidad Periodos A Predecir</Form.Label>
                <Form.Control
                  type="number"
                  value={cantidadPeriodosAPredecir}
                  onChange={(e) => setCantidadPeriodosAPredecir(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cantidad Periodos A Usar</Form.Label>
                <Form.Control
                  type="number"
                  value={cantidadPeriodosAUsar}
                  onChange={(e) => setCantidadPeriodosAUsar(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Demanda Anual de articulo</Form.Label>
                <Form.Control
                  type="number"
                  value={articuloSeleccionado?.demandaAnual || ""}
                  onChange={(e) => setCantidadDemandaAnual(Number(e.target.value))}
                  disabled
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleError}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null
      }
    </>
  );
};

export default PrediccionDemandaModal

