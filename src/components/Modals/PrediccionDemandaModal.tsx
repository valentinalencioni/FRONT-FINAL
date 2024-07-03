import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { PrediccionDemanda } from '../../types/PrediccionDemanda';
import { ParametrosPrediccionDTO } from '../../types/ParametrosPrediccionDTO';
import { PrediccionDemandaService } from '../../services/PrediccionDemandaService';
import { ModalType } from '../../enums/ModalType';
import { toast } from 'react-toastify';

interface PrediccionDemandaModalProps {
  title: string;
  predi: PrediccionDemanda;
  modalType: ModalType;
  show: boolean;
  onHide: () => void;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrediccionDemandaModal: React.FC<PrediccionDemandaModalProps> = ({
  title,
  predi,
  modalType,
  show,
  onHide,
  refreshData,
}) => {
  const [parametros, setParametros] = useState<ParametrosPrediccionDTO>({
    articuloId: predi.articulo.id,
    fechaDesde: new Date().toISOString().split('T')[0],
    fechaHasta: new Date().toISOString().split('T')[0],
    coeficientes: [],
    mesPrediccion: 1,
    anioPrediccion: new Date().getFullYear(),
    alfa: 0,
    cantidadPeriodosAPredecir: 0,
    cantidadPeriodosAUsar: 0,
    cantidadDemandaAnual: 0,
    error: 0,
    porcentajeDeError: 0,
    prediccion: 0,
  });

  const [articulos, setArticulos] = useState<any[]>([]);
  const coeficientesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch all articles for the dropdown
    const fetchArticulos = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/v1/articulos'); // Adjust the URL as necessary
        const data = await response.json();
        setArticulos(data);
      } catch (error) {
        console.error('Error fetching articulos:', error);
      }
    };

    fetchArticulos();
  }, []);

  useEffect(() => {
    setParametros((prevState) => ({
      ...prevState,
      articuloId: predi.articulo.id,
    }));
  }, [predi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === ModalType.CREATE) {
        await PrediccionDemandaService.createPrediccion(parametros);
      } else if (modalType === ModalType.UPDATE) {
        await PrediccionDemandaService.calcularError(parametros);
      }
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Prediccion demanda creada exitosamente', { position: 'top-center' });
    } catch (error) {
        console.error( error);
        toast.error('Error al crear la prediccion', { position: 'top-center' });
    }
  };

  const handleDelete = async () => {
    try {
      await PrediccionDemandaService.deletePrediccionDemanda(predi.id);
      onHide();
      refreshData(prevState => !prevState);
      toast.success('Prediccion demanda eliminada exitosamente', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la prediccion', { position: 'top-center' });
    }
  };

  const handleInputChange = (key: keyof ParametrosPrediccionDTO, value: any) => {
    setParametros((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalType === ModalType.DELETE ? (
          <p>¿Estás seguro de que deseas eliminar esta predicción?</p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="articuloId">
              <Form.Label>Artículo</Form.Label>
              <Form.Control
                as="select"
                name="articuloId"
                value={parametros.articuloId}
                onChange={(e) => handleInputChange('articuloId', e.target.value)}
                required
              >
                <option value="">Seleccione un artículo</option>
                {articulos.map((articulo) => (
                  <option key={articulo.id} value={articulo.id}>
                    {articulo.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="fechaDesde">
              <Form.Label>Fecha Desde</Form.Label>
              <Form.Control
                type="date"
                name="fechaDesde"
                value={parametros.fechaDesde}
                onChange={(e) => handleInputChange('fechaDesde', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="fechaHasta">
              <Form.Label>Fecha Hasta</Form.Label>
              <Form.Control
                type="date"
                name="fechaHasta"
                value={parametros.fechaHasta}
                onChange={(e) => handleInputChange('fechaHasta', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="coeficientes">
              <Form.Label>Coeficientes</Form.Label>
              <Form.Control
                type="text"
                name="coeficientes"
                ref={coeficientesRef}
                defaultValue={parametros.coeficientes.join(',')}
                placeholder="Ej: 0.1,0.5,0.4"
                required
              />
            </Form.Group>
            <Form.Group controlId="mesPrediccion">
              <Form.Label>Mes Predicción</Form.Label>
              <Form.Control
                type="number"
                name="mesPrediccion"
                value={parametros.mesPrediccion}
                onChange={(e) => handleInputChange('mesPrediccion', parseInt(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group controlId="anioPrediccion">
              <Form.Label>Año Predicción</Form.Label>
              <Form.Control
                type="number"
                name="anioPrediccion"
                value={parametros.anioPrediccion}
                onChange={(e) => handleInputChange('anioPrediccion', parseInt(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group controlId="alfa">
              <Form.Label>Alfa</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="alfa"
                value={parametros.alfa}
                onChange={(e) => handleInputChange('alfa', parseFloat(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group controlId="cantidadPeriodosAPredecir">
              <Form.Label>Cantidad de Periodos a Predecir</Form.Label>
              <Form.Control
                type="number"
                name="cantidadPeriodosAPredecir"
                value={parametros.cantidadPeriodosAPredecir}
                onChange={(e) =>
                  handleInputChange('cantidadPeriodosAPredecir', parseInt(e.target.value))
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="cantidadPeriodosAUsar">
              <Form.Label>Cantidad de Periodos a Usar</Form.Label>
              <Form.Control
                type="number"
                name="cantidadPeriodosAUsar"
                value={parametros.cantidadPeriodosAUsar}
                onChange={(e) =>
                  handleInputChange('cantidadPeriodosAUsar', parseInt(e.target.value))
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="cantidadDemandaAnual">
              <Form.Label>Cantidad Demanda Anual</Form.Label>
              <Form.Control
                type="number"
                name="cantidadDemandaAnual"
                value={parametros.cantidadDemandaAnual}
                onChange={(e) =>
                  handleInputChange('cantidadDemandaAnual', parseInt(e.target.value))
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="error">
              <Form.Label>Error</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="error"
                value={parametros.error}
                onChange={(e) => handleInputChange('error', parseFloat(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group controlId="porcentajeDeError">
              <Form.Label>Porcentaje de Error</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="porcentajeDeError"
                value={parametros.porcentajeDeError}
                onChange={(e) =>
                  handleInputChange('porcentajeDeError', parseFloat(e.target.value))
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="prediccion">
              <Form.Label>Predicción</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="prediccion"
                value={parametros.prediccion}
                onChange={(e) => handleInputChange('prediccion', parseFloat(e.target.value))}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        )}
      </Modal.Body>
      {modalType === ModalType.DELETE && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default PrediccionDemandaModal;
