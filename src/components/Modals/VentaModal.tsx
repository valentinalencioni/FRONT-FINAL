import { useEffect, useState } from "react";
import { ModalType } from "../../enums/ModalType";
import { Articulo } from "../../types/Articulo";
import { Venta } from "../../types/Venta";
import { VentaService } from "../../services/VentaService";
import { toast } from "react-toastify";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { ArticuloService } from "../../services/ArticuloService";

type VentaModalProps = {
    show: boolean;
    onHide: () => void;
    title: string;
    modalType: ModalType;
    venta: Venta;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const VentaModal = ({
    show,
    onHide,
    title,
    modalType,
    venta,
    refreshData,
}: VentaModalProps) => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [articulosSeleccionados, setArticulosSeleccionados] = useState<{ articulo: Articulo, cantidad: number }[]>([]);

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
            const detalleVentaDTOList = articulosSeleccionados.map(item => ({
                articulo_id: item.articulo.id,
                cantidad: item.cantidad,
            }));
            await VentaService.createVenta(detalleVentaDTOList);
            onHide();
            refreshData(prevState => !prevState);
            toast.success('Venta creada exitosamente', { position: 'top-center' });
        } catch (error) {
            console.error(error);
            toast.error('Error al crear la venta', { position: 'top-center' });
        }
    };

    const handleDelete = async () => {
        try {
            await VentaService.deleteVenta(venta.id);
            onHide();
            refreshData(prevState => !prevState);
            toast.success('Venta eliminada exitosamente', { position: 'top-center' });
        } catch (error) {
            console.error(error);
            toast.error('Error al eliminar la venta', { position: 'top-center' });
        }
    };

    const handleArticuloSelect = (articulo: Articulo, cantidad: number) => {
        setArticulosSeleccionados(prevState => {
            const index = prevState.findIndex(item => item.articulo.id === articulo.id);
            if (index !== -1) {
                const updated = [...prevState];
                updated[index].cantidad = cantidad;
                return updated;
            } else {
                return [...prevState, { articulo, cantidad }];
            }
        });
    };

    const handleCantidadChange = (articulo: Articulo, cantidad: number) => {
        setArticulosSeleccionados(prevState => {
            const index = prevState.findIndex(item => item.articulo.id === articulo.id);
            if (index !== -1) {
                const updated = [...prevState];
                updated[index].cantidad = cantidad;
                return updated;
            } else {
                return [...prevState, { articulo, cantidad }];
            }
        });
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
                            <p>¿Seguro que desea eliminar esta venta?</p>
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
                <div>
                    <Modal show={show} onHide={onHide} centered style={{ paddingTop: '400px' }}>
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Seleccionar Artículo</th>
                                            <th>Stock Actual</th>
                                            <th>Precio</th>
                                            <th>Cantidad a Vender</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articulos.map(articulo => (
                                            <tr key={articulo.id}>
                                                <td>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="articulo"
                                                        value={articulo.id}
                                                        checked={articulosSeleccionados.some(item => item.articulo.id === articulo.id)}
                                                        onChange={e => handleArticuloSelect(articulo, e.target.checked ? 0 : -1)}
                                                    />
                                                    {articulo.nombre}
                                                </td>
                                                <td>{articulo.stockActual}</td>
                                                <td>{articulo.precio}</td>
                                                <td>
                                                    {articulosSeleccionados.some(item => item.articulo.id === articulo.id) && (
                                                        <Form.Control
                                                            type="number"
                                                            name="cantidad"
                                                            value={articulosSeleccionados.find(item => item.articulo.id === articulo.id)?.cantidad || 0}
                                                            onChange={e => handleCantidadChange(articulo, Number(e.target.value))}
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

export default VentaModal;
